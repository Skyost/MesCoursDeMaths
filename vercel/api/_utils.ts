// noinspection ES6PreferShortImport

import 'dotenv/config'
import crypto from 'crypto'
import type { IncomingHttpHeaders } from 'http'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Octokit } from '@octokit/core'
import { siteMeta } from '../../site/meta'
import { authentication } from '../../site/authentication'

export interface Calendar {
  data: { [key: string]: string },
  sha: string
}

export async function loadCalendar (octokit: Octokit): Promise<Calendar | null> {
  let githubResponse: any
  try {
    githubResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: siteMeta.github.username,
      repo: siteMeta.github.dataRepository,
      path: 'calendar.json'
    })
  } catch (ex) {
    githubResponse = ex
  }
  if (githubResponse.status === 404) {
    return null
  }
  const content = Buffer.from(githubResponse.data.content, 'base64').toString('utf8')
  return { data: JSON.parse(content), sha: githubResponse.data.sha }
}

export function allowCors (request: VercelRequest, response: VercelResponse): boolean {
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Origin', siteMeta.url)
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin'
  )
  if (request.method?.toUpperCase() === 'OPTIONS') {
    response.status(200).send(null)
    return false
  }
  return true
}

const algorithm = 'AES-256-ECB'

export function encrypt (text: string): string {
  const cipher = crypto.createCipheriv(algorithm, authentication.encryptionKey, null)
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

export function decrypt (text: string): string {
  const decipher = crypto.createDecipheriv(algorithm, authentication.encryptionKey, null)
  let decrypted = decipher.update(text, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export function createOctokitFromRequest (request: VercelRequest, response: VercelResponse) : Octokit | null {
  const accessToken = readAccessTokenFromHeaders(request.headers)
  if (!accessToken) {
    response.status(401).send('Pas de jeton d\'accès.')
    return null
  }
  return new Octokit({ auth: decrypt(accessToken) })
}

function readAccessTokenFromHeaders (headers: IncomingHttpHeaders) {
  if (!('authorization' in headers) || !headers.authorization!.startsWith('Bearer ')) {
    return null
  }
  const authHeader: string = headers.authorization!
  return authHeader.substring(7, authHeader.length)
}
