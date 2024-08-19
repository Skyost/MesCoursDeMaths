/**
 * Enumeration of possible levels for a math lesson.
 * @type {'sixieme' | 'cinquieme' | 'quatrieme' | 'troisieme' | 'seconde' | 'premiere-stmg'}
 */
export type LevelId = 'sixieme' | 'cinquieme' | 'quatrieme' | 'troisieme' | 'seconde' | 'premiere-stmg'

/**
 * Represents a level for a math lesson.
 * @interface
 * @export
 */
export interface Level {
  /**
   * Unique identifier for the level.
   * @type {LevelId}
   */
  id: LevelId

  /**
   * Name or description of the level.
   * @type {string}
   */
  name: string

  /**
   * Numeric representation of the level (eg. 6, 5, 4 or 3).
   * @type {number}
   */
  number: number

  /**
   * Color associated with the level.
   * @type {string}
   */
  color: string
}
