import type { Level } from '~/types'

/**
 * Object containing levels.
 * @const {{[key: string]: Level}}
 * @export
 */
export const levels: {[key: string]: Level} = {
  sixieme: {
    id: 'sixieme',
    name: 'Sixième',
    number: 6,
    color: 'red'
  },
  cinquieme: {
    id: 'cinquieme',
    name: 'Cinquième',
    number: 5,
    color: 'blue'
  },
  troisieme: {
    id: 'troisieme',
    name: 'Troisième',
    number: 3,
    color: 'amber'
  }
}

/**
 * Returns the subtitle for a given level.
 * @param {Level} level - The level.
 * @returns {string} - The level subtitle.
 */
export const getLevelSubtitle = (level: Level): string => `Cours de ${level.number}e`

/**
 * Returns the URL for a given level.
 * @param {Level} level - The level.
 * @returns {string} - The level URL.
 */
export const getLevelUrl = (level: Level): string => `/cours/${level.id}/`

/**
 * Returns the image URL for a given level.
 * @param {Level} level - The level.
 * @returns {string} - The level image URL.
 */
export const getLevelImage = (level: Level): string => `/images/levels/${level.id}.svg`
