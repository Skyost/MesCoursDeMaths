import type { Level } from '~/types'

/**
 * Object containing levels.
 * @const {{[key: string]: Level}}
 * @export
 */
export const levels: { [key: string]: Level } = {
  'sixieme': {
    id: 'sixieme',
    name: 'Sixième',
    short: '6e',
    color: 'red'
  },
  'cinquieme': {
    id: 'cinquieme',
    name: 'Cinquième',
    short: '5e',
    color: 'blue'
  },
  'troisieme': {
    id: 'troisieme',
    name: 'Troisième',
    short: '3e',
    color: 'amber'
  },
  'seconde': {
    id: 'seconde',
    name: 'Seconde',
    short: '2nde',
    color: 'indigo'
  },
  'premiere-stmg': {
    id: 'premiere-stmg',
    name: 'Première STMG',
    short: '1ère STMG',
    color: 'pink'
  }
}

/**
 * Returns the subtitle for a given level.
 * @param {Level} level - The level.
 * @returns {string} - The level subtitle.
 */
export const getLevelSubtitle = (level: Level): string => `Cours de ${level.short}`

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
export const getLevelImage = (level: Level): string => `/images/${level.id}/index.svg`
