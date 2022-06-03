import crypto from '../../utils/crypto'
import site from '../../../site'

const cookie = require('cookie')
const { createOAuthAppAuth } = require('@octokit/auth-oauth-app')

export default async function handler (request, response) {
  if (request.query.code && request.query.state) {
    const auth = createOAuthAppAuth({
      clientId: site.github.authentication.clientId,
      clientSecret: site.github.authentication.clientSecret
    })
    const githubResponse = await auth({
      type: 'oauth-user',
      code: request.query.code,
      state: request.query.state
    })
    if (githubResponse.token) {
      const expiration = new Date()
      expiration.setDate(expiration.getDate() + site.github.authentication.cookieExpirationDays)
      response.setHeader('Set-Cookie', [
        cookie.serialize('access_token', crypto.encrypt(githubResponse.token), { expires: expiration, path: '/' })
      ])
      response.redirect(`${site.site.url}/prof`)
    } else {
      response.status(500).send("Erreur provenant sûrement d'une mauvaise configuration.")
    }
    return
  }
  response.status(401).send("Votre requête doit contenir un 'code' provenant de Github.")
}
