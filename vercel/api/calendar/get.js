import github from '../../utils/octokit'
import calendar from '../../utils/calendar'

export default async function handler (request, response) {
  if (!request.query.date) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = github.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendarObject = await calendar.loadCalendar(octokit)
  response.status(200).json({
    content: calendarObject === null || !Object.prototype.hasOwnProperty.call(calendarObject, request.query.date) ? '' : calendarObject[request.query.date]
  })
}
