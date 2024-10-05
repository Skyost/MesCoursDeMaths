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
   * Short representation of the level (eg. 6e).
   * @type {string}
   */
  short: string

  /**
   * Color associated with the level.
   * @type {string}
   */
  color: string

  /**
   * Other resources for this level.
   * @type {Resource[]}
   */
  otherResources?: Resource[]
}

/**
 * A resource associated to this level.
 * @interface
 * @export
 */
export interface Resource {
  /**
   * The resource name.
   * @type {string}
   */
  name: string
  /**
   * The resource description.
   * @type {string}
   */
  description: string
  /**
   * The resource URL.
   * @type {string}
   */
  url: string
}
