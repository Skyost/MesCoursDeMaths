import siteMeta from '../../site/meta'

function allowCors (request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true)
  response.setHeader('Access-Control-Allow-Origin', siteMeta.url)
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin'
  )
  if (request.method.toUpperCase() === 'OPTIONS') {
    response.status(200)
    return false
  }
  return true
}

export default {
  allowCors
}
