import github from '../../utils/octokit'
import site from '../../site'

export default async function handler (request, response) {
  const path = request.query.path
  if (!path) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = github.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    path: `${site.github.lessonsDirectory}${path}`
  })
  const data = githubResponse.data
  response.status(githubResponse.status).json({
    name: data.name,
    path: data.path.replace(site.github.lessonsDirectory, ''),
    sha: data.sha,
    content: data.content
  })
}
