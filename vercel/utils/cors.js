import site from '../../site'

function allowCors (response) {
  response.setHeader('Access-Control-Allow-Credentials', false)
  response.setHeader('Access-Control-Allow-Origin', site.site.url)
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )
}

export default {
  allowCors
}
