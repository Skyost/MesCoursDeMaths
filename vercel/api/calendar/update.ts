// noinspection ES6PreferShortImport

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { siteMeta } from '../../../site/meta'
import { createOctokitFromRequest, allowCors, loadCalendar, type Calendar } from '../_utils.js'

export default async function handler (request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  if (!('date' in request.body) || !('content' in request.body)) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendar: Calendar = (await loadCalendar(octokit)) ?? { data: {}, sha: '' }
  const date = request.body.date.toString()
  if (request.body.content.length === 0) {
    delete calendar.data[date]
  } else {
    calendar.data[date] = request.body.content
  }
  const githubResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: 'calendar.json',
    message: `Mise à jour d'un événement pour la date \`${date}\`.`,
    sha: calendar.sha,
    content: Buffer.from(JSON.stringify(calendar.data), 'utf8').toString('base64')
  })
  response.status(githubResponse.status).json({
    commit: githubResponse.data.commit,
    content: date in calendar.data ? calendar.data[date] : ''
  })
}
