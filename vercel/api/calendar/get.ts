import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createOctokitFromRequest, allowCors, loadCalendar } from '../_utils.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  if (!('date' in request.query)) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendar = await loadCalendar(octokit)
  response.status(200).json({
    content: calendar === null || !(request.query.date.toString() in calendar.data) ? '' : calendar.data[request.query.date.toString()]
  })
}
