import path from 'path'

/**
 * Normalizes a string by removing diacritics and converting to lowercase.
 *
 * @param {string} string - Input string.
 * @returns {string} - Normalized string.
 */
export const normalizeString = (string: string): string => string.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/**
 * Extracts the filename from a given file path.
 *
 * @param {string} file - File path.
 * @returns {string} - Filename.
 */
export const getFileName = (file: string): string => path.parse(file).name

/**
 * Decodes a base 64 encoded string.
 *
 * @param string The encoded string.
 * @return {string} The decoded string.
 */
export const base64Decode = (string: string): string => decodeURIComponent(atob(string).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))

/**
 * Decodes a blob.
 *
 * @param blob The blob.
 * @return {Promise<string>} The decoded blob.
 */
export const blobAsDataUrl = (blob: Blob): Promise<string> => new Promise<string>((resolve, reject) => {
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
