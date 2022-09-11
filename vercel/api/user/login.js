import { createOAuthAppAuth } from '@octokit/auth-oauth-app'
import cryptoUtils from '../../utils/crypto'
import authentication from '../../../site/authentication'
import debug from '../../../site/debug'
import siteMeta from '../../../site/meta'
import cookie from '../../../site/cookie'

export default async function handler (request, response) {
  if (request.query.code && request.query.state) {
    const auth = createOAuthAppAuth({
      clientId: authentication.clientId,
      clientSecret: authentication.clientSecret
    })
    const githubResponse = await auth({
      type: 'oauth-user',
      code: request.query.code,
      state: request.query.state
    })
    if (githubResponse.token) {
      const expiration = new Date()
      expiration.setDate(expiration.getDate() + cookie.cookieExpirationDays)

      const url = debug.debug ? 'http://localhost:3000' : siteMeta.url
      const params = new URLSearchParams({
        access_token: cryptoUtils.encrypt(githubResponse.token),
        expiration: expiration.getTime().toString()
      })
      response.redirect(`${url}/prof?${params}`)
    } else {
      response.status(500).send("Erreur provenant sûrement d'une mauvaise configuration.")
    }
    return
  }
  response.status(401).send("Votre requête doit contenir un 'code' provenant de Github.")
}
