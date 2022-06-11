import octokitUtils from '../../utils/octokit'
import site from '../../../site'
import corsUtils from '../../utils/cors'

export default async function handler (request, response) {
  corsUtils.allowCors(response)
  const path = request.query.path
  if (!path || !request.query.sha) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const githubResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    path: `${site.github.lessonsDirectory}${path}`,
    message: `Suppression de \`${path}\`.`,
    sha: request.query.sha
  })
  const data = githubResponse.data
  response.status(githubResponse.status).json({
    commit: data.commit
  })
}
