import github from '../../utils/octokit'
import site from '../../site'

export default async function handler (request, response) {
  if (!request.body.date || !request.body.content) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = github.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  let githubResponse
  try {
    githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: site.github.username,
      repo: site.github.dataRepository,
      path: site.github.calendarFile
    })
  } catch (ex) {
    githubResponse = ex
  }
  let sha
  let calendar = {}
  if (githubResponse.status !== 404) {
    calendar = JSON.parse(Buffer.from(githubResponse.data.content, 'base64').toString('utf8'))
    sha = githubResponse.data.sha
  }
  if (request.body.content.length === 0) {
    delete calendar[request.body.date]
  } else {
    calendar[request.body.date] = request.body.content
  }
  githubResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    path: site.github.calendarFile,
    message: `Mise à jour d'un événement pour la date \`${request.body.date}\`.`,
    sha,
    content: Buffer.from(JSON.stringify(calendar), 'utf8').toString('base64')
  })
  response.status(githubResponse.status).json({
    commit: githubResponse.data.commit,
    content: Object.prototype.hasOwnProperty.call(calendar, request.body.date) ? calendar[request.body.date] : ''
  })
}
