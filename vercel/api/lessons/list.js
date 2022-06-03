import github from '../../utils/octokit'
import site from '../../../site'

export default async function handler (request, response) {
  const octokit = github.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  let path = request.query.path ?? ''
  path = `${site.github.lessonsDirectory}${path}`
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1)
  }
  const githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    path
  })
  const contents = githubResponse.data
  const jsonResponse = []
  for (const content of contents) {
    jsonResponse.push({
      name: content.name,
      path: content.path.replace(site.github.lessonsDirectory, ''),
      sha: content.sha,
      type: content.type
    })
  }
  jsonResponse.sort(function (a, b) {
    if (a.type === 'dir') {
      if (b.type !== 'dir') {
        return -1
      }
    } else if (b.type === 'dir') {
      return 1
    }
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
  response.status(githubResponse.status).json(jsonResponse)
}
