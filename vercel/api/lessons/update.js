import octokitUtils from '../../utils/octokit'
import site from '../../../site'

export default async function handler (request, response) {
  const path = request.body.path
  if (!path || !request.body.sha || !request.body.content) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const githubResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    path: `${site.github.lessonsDirectory}${path}`,
    message: `Mise à jour de \`${path}\`.`,
    sha: request.body.sha,
    content: request.body.content
  })
  const data = githubResponse.data
  const file = data.content
  response.status(githubResponse.status).json({
    commit: data.commit,
    name: file.name,
    path: file.path.replace(site.github.lessonsDirectory, ''),
    sha: file.sha,
    content: file.content
  })
}
