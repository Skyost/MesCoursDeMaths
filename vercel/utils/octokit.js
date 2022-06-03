import crypto from './crypto'

const cookie = require('cookie')
const { Octokit } = require('@octokit/core')

function createOctokitFromRequest (request, response) {
  const cookies = cookie.parse(request.headers.cookie)
  if (!('access_token' in cookies)) {
    response.status(401).send('Pas de jeton d\'accès.')
    return null
  }
  return new Octokit({ auth: crypto.decrypt(cookies.access_token) })
}

export default {
  createOctokitFromRequest
}
