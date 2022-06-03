import api from '../api'

const crypto = require('crypto')
const algorithm = 'AES-256-ECB'

function encrypt (text) {
  const cipher = crypto.createCipheriv(algorithm, api.encryptionKey, null)
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

function decrypt (text) {
  const decipher = crypto.createDecipheriv(algorithm, api.encryptionKey, null)
  let decrypted = decipher.update(text, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export default {
  encrypt,
  decrypt
}
