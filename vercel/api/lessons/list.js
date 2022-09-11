import octokitUtils from '../../utils/octokit'
import siteMeta from '../../../site/meta'
import directories from '../../../site/directories'
import corsUtils from '../../utils/cors'

export default async function handler (request, response) {
  corsUtils.allowCors(response)
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  let path = request.query.path ?? ''
  path = `${directories.lessonsDirectory}${path}`
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1)
  }
  const githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path
  })
  const contents = githubResponse.data
  const jsonResponse = []
  for (const content of contents) {
    jsonResponse.push({
      name: content.name,
      path: content.path.replace(directories.lessonsDirectory, ''),
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
