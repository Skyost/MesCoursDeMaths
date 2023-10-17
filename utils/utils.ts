import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

export const normalizeString = (string: string) => string.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export const getFileName = (file: string) => path.parse(file).name

export const getDirectories = (path: string) => fs.readdirSync(path).filter(file => fs.statSync(path + '/' + file).isDirectory())

export const generateChecksum = (string: string) => crypto
  .createHash('md5')
  .update(string, 'utf8')
  .digest('hex')

export const base64Decode = (string: string) => decodeURIComponent(atob(string).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))

export const blobAsDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (event: ProgressEvent<FileReader>) => {
    if (event.target) {
      resolve(event.target.result as string)
    }
  }
  reader.onerror = (error: any) => {
    reader.abort()
    reject(error)
  }
  reader.readAsDataURL(blob)
})
