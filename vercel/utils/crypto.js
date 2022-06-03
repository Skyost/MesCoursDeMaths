import 'dotenv/config'
import site from '../../site'

const crypto = require('crypto')
const algorithm = 'AES-256-ECB'

function encrypt (text) {
  const cipher = crypto.createCipheriv(algorithm, site.encryptionKey, null)
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

function decrypt (text) {
  const decipher = crypto.createDecipheriv(algorithm, site.encryptionKey, null)
  let decrypted = decipher.update(text, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export default {
  encrypt,
  decrypt
}
