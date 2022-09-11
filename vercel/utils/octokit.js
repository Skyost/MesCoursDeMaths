import 'dotenv/config'
import { Octokit } from '@octokit/core'
import accessTokenUtils from '../../utils/access-token'
import cryptoUtils from './crypto'

function createOctokitFromRequest (request, response) {
  const accessToken = accessTokenUtils.readAccessTokenFromHeaders(request.headers)
  if (!accessToken) {
    response.status(401).send('Pas de jeton d\'accès.')
    return null
  }
  return new Octokit({ auth: cryptoUtils.decrypt(accessToken) })
}

export default {
  createOctokitFromRequest
}
