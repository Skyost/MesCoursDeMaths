import site from '../site'

function readAccessTokenFromCookies (cookies) {
  return cookies.get('access_token')
}

function storeAccessTokenInCookies (cookies, accessToken, expiration) {
  if (!expiration) {
    expiration = new Date()
    expiration.setDate(expiration.getDate() + site.github.authentication.cookieExpirationDays)
  }

  cookies.set('access_token', accessToken, {
    path: '/',
    expires: expiration,
    sameSite: 'Lax',
    secure: true
  })
}

function removeAccessTokenFromCookies (cookies) {
  cookies.remove('access_token')
}

function readAccessTokenFromHeaders (headers) {
  if (!Object.prototype.hasOwnProperty.call(headers, 'authorization') || !headers.authorization.startsWith('Bearer ')) {
    return null
  }
  const authHeader = headers.authorization
  return authHeader.substring(7, authHeader.length)
}

function getAuthorizationHeaders (cookies) {
  return {
    Authorization: `Bearer ${readAccessTokenFromCookies(cookies)}`
  }
}

export default {
  readAccessTokenFromCookies,
  storeAccessTokenInCookies,
  removeAccessTokenFromCookies,
  readAccessTokenFromHeaders,
  getAuthorizationHeaders
}
