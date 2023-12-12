// noinspection ES6PreferShortImport

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { siteMeta } from '../../../site/meta'
import { createOctokitFromRequest, allowCors } from '../_utils'
import { siteContentSettings } from '~/site/content'

export default async function handler (request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  if (!('path' in request.query) || !('sha' in request.query) || !('name' in request.query)) {
    response.status(400).send('Il manque au moins un paramètre.')
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  const path = request.query.path.toString()
  let newPath = request.query.name
  if (path.lastIndexOf('/') !== -1) {
    newPath = path.substring(0, path.lastIndexOf('/')) + '/' + newPath
  }
  const getResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${siteContentSettings.dataLatexDirectory}/${path}`
  })
  if (!('content' in getResponse.data)) {
    response.status(500).send('Réponse de Github incorrecte.')
    return
  }
  const deleteResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${siteContentSettings.dataLatexDirectory}/${path}`,
    message: `Renommage de \`${path}\` (1/2).`,
    sha: request.query.sha.toString()
  })
  const deleteCommit = deleteResponse.data.commit
  const putResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path: `${siteContentSettings.dataLatexDirectory}/${newPath}`,
    message: `Renommage de \`${path}\` (2/2).`,
    content: getResponse.data.content
  })
  const createCommit = putResponse.data.commit
  const data = putResponse.data
  const file = data.content
  if (!file || !('name' in data) || !('path' in data) || !('sha' in data)) {
    response.status(500).send('Réponse de Github incorrecte.')
    return
  }
  response.status(putResponse.status).json({
    deleteCommit,
    createCommit,
    name: file.name,
    path: file.path?.replace(`${siteContentSettings.dataLatexDirectory}/`, ''),
    sha: file.sha
  })
}
