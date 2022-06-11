import corsUtils from '../../utils/cors'
import octokitUtils from '../../utils/octokit'
import site from '../../../site'

export default async function handler (request, response) {
  corsUtils.allowCors(response)
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  let githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    path: site.github.calendarFile
  })
  githubResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    path: site.github.calendarFile,
    message: 'Suppression du calendrier.',
    sha: githubResponse.data.sha
  })
  const data = githubResponse.data
  response.status(githubResponse.status).json({
    commit: data.commit
  })
}
