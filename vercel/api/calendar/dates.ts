import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createOctokitFromRequest, allowCors, loadCalendar } from '../_utils.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendar = await loadCalendar(octokit)
  response.status(200).json({
    dates: calendar === null ? [] : Object.keys(calendar.data)
  })
}
