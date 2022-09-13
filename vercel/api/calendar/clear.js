import corsUtils from '../../utils/cors'
import octokitUtils from '../../utils/octokit'
import siteMeta from '../../../site/meta'
import directories from '../../../site/directories'

export default async function handler (request, response) {
  if (!corsUtils.allowCors(request, response)) {
    return
  }
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  let githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: directories.calendarFile
  })
  githubResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: directories.calendarFile,
    message: 'Suppression du calendrier.',
    sha: githubResponse.data.sha
  })
  const data = githubResponse.data
  response.status(githubResponse.status).json({
    commit: data.commit
  })
}
