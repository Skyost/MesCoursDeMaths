import 'dotenv/config'
import siteMeta from '../../site/meta'
import directories from '../../site/directories'

async function loadCalendar (octokit) {
  let githubResponse
  try {
    githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: siteMeta.github.username,
      repo: siteMeta.github.dataRepository,
      path: directories.calendarFile
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
