import octokitUtils from '../../utils/octokit'
import siteMeta from '../../../site/meta'
import directories from '../../../site/directories'
import corsUtils from '../../utils/cors'

export default async function handler (request, response) {
  corsUtils.allowCors(response)
  const path = request.query.path
  if (!path) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${directories.lessonsDirectory}${path}`
  })
  const data = githubResponse.data
  response.status(githubResponse.status).json({
    name: data.name,
    path: data.path.replace(directories.lessonsDirectory, ''),
    sha: data.sha,
    content: data.content
  })
}
