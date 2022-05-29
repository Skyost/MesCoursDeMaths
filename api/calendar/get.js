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
  const calendar = await calendar.loadCalendar(octokit)
  response.status(200).json({
    content: calendar === null || !Object.prototype.hasOwnProperty.call(calendar, request.query.date) ? '' : calendar[request.query.date]
  })
}
