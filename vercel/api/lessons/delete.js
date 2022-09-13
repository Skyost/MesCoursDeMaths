import octokitUtils from '../../utils/octokit'
import siteMeta from '../../../site/meta'
import directories from '../../../site/directories'
import corsUtils from '../../utils/cors'

export default async function handler (request, response) {
  if (!corsUtils.allowCors(request, response)) {
    return
  }
  const path = request.query.path
  if (!path || !request.query.sha) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = octokitUtils.createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const githubResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${directories.lessonsDirectory}${path}`,
    message: `Suppression de \`${path}\`.`,
    sha: request.query.sha
  })
  const data = githubResponse.data
  response.status(githubResponse.status).json({
    commit: data.commit
  })
}
