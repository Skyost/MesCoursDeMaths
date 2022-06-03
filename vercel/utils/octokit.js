import 'dotenv/config'
import crypto from './crypto'

const cookie = require('cookie')
const { Octokit } = require('@octokit/core')

function createOctokitFromRequest (request, response) {
  if (!Object.prototype.hasOwnProperty.call(request.headers, 'cookie')) {
    response.status(401).send('Pas de jeton d\'accès.')
    return null
  }
  const cookies = cookie.parse(request.headers.cookie)
  if (!Object.prototype.hasOwnProperty.call(cookies, 'access_token')) {
    response.status(401).send('Pas de jeton d\'accès.')
    return null
  }
  return new Octokit({ auth: crypto.decrypt(cookies.access_token) })
}

export default {
  createOctokitFromRequest
}
