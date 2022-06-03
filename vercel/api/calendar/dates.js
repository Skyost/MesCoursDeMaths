import github from '../../utils/octokit'
import calendar from '../../utils/calendar'

export default async function handler (request, response) {
  const octokit = github.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendarObject = await calendar.loadCalendar(octokit)
  response.status(200).json({
    dates: calendarObject === null ? [] : Object.keys(calendarObject)
  })
}
