// noinspection ES6PreferShortImport

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { siteMeta } from '../../../site/meta'
import { createOctokitFromRequest, allowCors } from '../_utils.js'
import { siteContentSettings } from '../../../site/content'

export default async function handler (request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  if (!('path' in request.body) || !('sha' in request.body) || !('content' in request.body)) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const path = request.body.path
  const githubResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${siteContentSettings.dataLatexDirectory}/${path}`,
    message: `Mise à jour de \`${path}\`.`,
    sha: request.body.sha,
    content: request.body.content
  })
  const data = githubResponse.data
  const file = data.content
  if (!file || !('content' in file) || !('path' in file)) {
    response.status(500).send('Réponse de Github incorrecte.')
    return
  }
  response.status(githubResponse.status).json({
    commit: data.commit,
    name: file.name,
    path: file.path?.replace(`${siteContentSettings.dataLatexDirectory}/`, ''),
    sha: file.sha,
    content: file.content
  })
}
