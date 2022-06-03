import api from '../api'

async function loadCalendar (octokit) {
  let githubResponse
  try {
    githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: api.github.username,
      repo: api.github.dataRepository,
      path: api.github.calendarFile
    })
  } catch (ex) {
    githubResponse = ex
  }
  if (githubResponse.status === 404) {
    return null
  }
  const data = githubResponse.data
  const content = Buffer.from(data.content, 'base64').toString('utf8')
  return JSON.parse(content)
}

export default {
  loadCalendar
}
