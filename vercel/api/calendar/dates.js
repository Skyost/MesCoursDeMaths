import octokitUtils from '../../utils/octokit'
import calendarUtils from '../../utils/calendar'

export default async function handler (request, response) {
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendarObject = await calendarUtils.loadCalendar(octokit)
  response.status(200).json({
    dates: calendarObject === null ? [] : Object.keys(calendarObject)
  })
}
