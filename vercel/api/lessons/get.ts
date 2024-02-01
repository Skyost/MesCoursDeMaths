// noinspection ES6PreferShortImport

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { siteMeta } from '../../../site/meta.js'
import { createOctokitFromRequest, allowCors } from '../_utils.js'
import { siteContentSettings } from '../../../site/content.js'

export interface APILessonsGetEntry {
  name: string,
  path: string,
  sha: string,
  content: string
}

export default async function handler (request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  if (!('path' in request.query)) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const path = request.query.path
  const githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${siteContentSettings.dataLatexDirectory}/${path}`
  })
  const data = githubResponse.data
  if (!('name' in data) || !('path' in data) || !('sha' in data) || !('content' in data)) {
    response.status(500).send('Réponse de Github incorrecte.')
    return
  }
  const fileContent: APILessonsGetEntry = {
    name: data.name,
    path: data.path.replace(`${siteContentSettings.dataLatexDirectory}/`, ''),
    sha: data.sha,
    content: data.content
  }
  response.status(githubResponse.status).json(fileContent)
}
