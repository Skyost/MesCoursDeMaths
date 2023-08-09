import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createOctokitFromRequest, allowCors, loadCalendar } from '../_utils'
import { siteMeta } from '../../../site/meta'
import { siteDirectories } from '../../../site/directories'

export default async function handler (request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendar = await loadCalendar(octokit)
  if (calendar === null) {
    response.status(200).json({
      commit: null
    })
    return
  }
  const deleteResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: siteDirectories.calendarFile,
    message: 'Suppression du calendrier.',
    sha: calendar.sha
  })
  const data = deleteResponse.data
  response.status(deleteResponse.status).json({
    commit: data.commit
  })
}
