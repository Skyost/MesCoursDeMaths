import Cookie from 'cookie-universal'

const cookieName = 'access_token'

function isAccessTokenInCookies () {
  const cookie = Cookie()
  return Object.prototype.hasOwnProperty.call(cookie.getAll(), cookieName)
}

function storeAccessTokenInCookies (accessToken, options) {
  const cookie = Cookie()
  cookie.set(cookieName, accessToken, options)
}

function removeAccessTokenFromCookies () {
  const cookie = Cookie()
  cookie.remove(cookieName)
}

function readAccessTokenFromHeaders (headers) {
  if (!Object.prototype.hasOwnProperty.call(headers, 'authorization') || !headers.authorization.startsWith('Bearer ')) {
    return null
  }
  const authHeader = headers.authorization
  return authHeader.substring(7, authHeader.length)
}

function getAuthorizationHeaders () {
  const cookies = Cookie()
  return {
    Authorization: `Bearer ${cookies.get(cookieName)}`
  }
}

export default {
  cookieName,
  isAccessTokenInCookies,
  storeAccessTokenInCookies,
  removeAccessTokenFromCookies,
  readAccessTokenFromHeaders,
  getAuthorizationHeaders
}
