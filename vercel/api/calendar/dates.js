import octokitUtils from '../../utils/octokit'
import calendarUtils from '../../utils/calendar'
import corsUtils from '../../utils/cors'

export default async function handler (request, response) {
  corsUtils.allowCors(response)
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendarObject = await calendarUtils.loadCalendar(octokit)
  response.status(200).json({
    dates: calendarObject === null ? [] : Object.keys(calendarObject)
  })
}
