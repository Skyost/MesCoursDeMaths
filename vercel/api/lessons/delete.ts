import type { VercelRequest, VercelResponse } from '@vercel/node'
import { siteMeta } from '../../../site/meta'
import { siteDirectories } from '../../../site/directories'
import { createOctokitFromRequest, allowCors } from '../_utils'

export default async function handler (request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  if (!('path' in request.query) || !('sha' in request.query)) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const path = request.query.path
  const githubResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${siteDirectories.lessonsDirectory}${path}`,
    message: `Suppression de \`${path}\`.`,
    sha: request.query.sha.toString()
  })
  const data = githubResponse.data
  response.status(githubResponse.status).json({
    commit: data.commit
  })
}
