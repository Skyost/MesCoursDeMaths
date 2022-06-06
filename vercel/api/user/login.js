import cryptoUtils from '../../utils/crypto'
import site from '../../../site'

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

      const url = site.debug ? 'http://localhost:3000' : site.site.url
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
