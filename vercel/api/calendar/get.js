import octokitUtils from '../../utils/octokit'
import calendarUtils from '../../utils/calendar'
import corsUtils from '../../utils/cors'

export default async function handler (request, response) {
  corsUtils.allowCors(response)
  if (!request.query.date) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const calendarObject = await calendarUtils.loadCalendar(octokit)
  response.status(200).json({
    content: calendarObject === null || !Object.prototype.hasOwnProperty.call(calendarObject, request.query.date) ? '' : calendarObject[request.query.date]
  })
}
