// noinspection ES6PreferShortImport

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { siteMeta } from '../../../site/meta.js'
import { createOctokitFromRequest, allowCors } from '../_utils.js'
import { siteContentSettings } from '../../../site/content.js'

export interface APILessonsListEntry {
  name: string
  path: string
  sha: string
  type: string
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!allowCors(request, response)) {
    return
  }
  const octokit = createOctokitFromRequest(request, response)
  if (octokit === null) {
    return
  }
  let path = request.query.path ?? ''
  path = `${siteContentSettings.dataLatexDirectory}/${path}`
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1)
  }
  const githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: siteMeta.github.username,
    repo: siteMeta.github.dataRepository,
    path
  })
  const contents = githubResponse.data as any[]
  const jsonResponse: APILessonsListEntry[] = []
  for (const content of contents) {
    jsonResponse.push({
      name: content.name,
      path: content.path.replace(`${siteContentSettings.dataLatexDirectory}/`, ''),
      sha: content.sha,
      type: content.type
    })
  }
  jsonResponse.sort(function (a, b) {
    if (a.type === 'dir') {
      if (b.type !== 'dir') {
        return -1
      }
    }
    else if (b.type === 'dir') {
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
