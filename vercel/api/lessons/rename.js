import octokitUtils from '../../utils/octokit'
import siteMeta from '../../../site/meta'
import directories from '../../../site/directories'
import corsUtils from '../../utils/cors'

export default async function handler (request, response) {
  if (!corsUtils.allowCors(request, response)) {
    return
  }
  const path = request.query.path
  if (!path || !request.query.sha || !request.query.name) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  let newPath = request.query.name
  if (path.lastIndexOf('/') !== -1) {
    newPath = path.substring(0, path.lastIndexOf('/')) + '/' + newPath
  }
  let githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${directories.lessonsDirectory}${path}`
  })
  const content = githubResponse.data.content
  githubResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${directories.lessonsDirectory}${path}`,
    message: `Renommage de \`${path}\` (1/2).`,
    sha: request.query.sha
  })
  const deleteCommit = githubResponse.data.commit
  githubResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${directories.lessonsDirectory}${newPath}`,
    message: `Renommage de \`${path}\` (2/2).`,
    content
  })
  const createCommit = githubResponse.data.commit
  const data = githubResponse.data
  const file = data.content
  response.status(githubResponse.status).json({
    deleteCommit,
    createCommit,
    name: file.name,
    path: file.path.replace(directories.lessonsDirectory, ''),
    sha: file.sha
  })
}
