import octokitUtils from '../../utils/octokit'
import siteMeta from '../../../site/meta'
import directories from '../../../site/directories'
import corsUtils from '../../utils/cors'

export default async function handler (request, response) {
  corsUtils.allowCors(response)
  const path = request.body.path
  if (!path || !request.body.sha || !request.body.content) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const githubResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${directories.lessonsDirectory}${path}`,
    message: `Mise à jour de \`${path}\`.`,
    sha: request.body.sha,
    content: request.body.content
  })
  const data = githubResponse.data
  const file = data.content
  response.status(githubResponse.status).json({
    commit: data.commit,
    name: file.name,
    path: file.path.replace(directories.lessonsDirectory, ''),
    sha: file.sha,
    content: file.content
  })
}
