// noinspection ES6PreferShortImport

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createOAuthAppAuth, type WebFlowAuthOptions } from '@octokit/auth-oauth-app'
import { encrypt } from '../_utils'
import { authentication } from '../../../site/authentication'
import { debug } from '../../../site/debug'
import { siteMeta } from '../../../site/meta'
import { cookieExpirationDays } from '../../../site/cookie'

export default async function handler (request: VercelRequest, response: VercelResponse) {
  if (request.query.code && request.query.state) {
    const auth = createOAuthAppAuth({
      clientId: authentication.clientId,
      clientSecret: authentication.clientSecret
    })
    const options: WebFlowAuthOptions = {
      type: 'oauth-user',
      code: request.query.code.toString(),
      state: request.query.state.toString()
    }
    const githubResponse = await auth(options)
    if ('token' in githubResponse) {
      const expiration = new Date()
      expiration.setDate(expiration.getDate() + cookieExpirationDays)

      const url = debug ? 'http://localhost:3000' : siteMeta.url
      const params = new URLSearchParams({
        access_token: encrypt(githubResponse.token.toString()),
        expiration: expiration.getTime().toString()
      })
      response.redirect(`${url}/prof/?${params}`)
    } else {
      response.status(500).send("Erreur provenant sûrement d'une mauvaise configuration.")
    }
    return
  }
  response.status(401).send("Votre requête doit contenir un 'code' provenant de Github.")
}
