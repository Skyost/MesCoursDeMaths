import * as path from 'path'
import * as fs from 'fs'
import crypto from 'crypto'

function normalizeString (string) {
  return string.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

function romanize (num) {
  if (isNaN(num)) {
    return NaN
  }
  const digits = String(+num).split('')
  const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
    '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
  let roman = ''
  let i = 3
  while (i--) {
    roman = (key[+digits.pop() + (i * 10)] || '') + roman
  }
  return Array(+digits.join('') + 1).join('M') + roman
}

function getFileName (file) {
  const extension = file.substring(file.lastIndexOf('.'))
  return path.basename(file.substring(0, file.length - extension.length))
}

function getDirectories (path) {
  return fs.readdirSync(path).filter(file => fs.statSync(path + '/' + file).isDirectory())
}

function generateChecksum (string) {
  return crypto
    .createHash('md5')
    .update(string, 'utf8')
    .digest('hex')
}

export default {
  normalizeString,
  romanize,
  getFileName,
  getDirectories,
  generateChecksum
}
