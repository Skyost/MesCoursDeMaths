/**
 * Enumeration of possible levels for a math lesson.
 */
export type LevelId = 'sixieme' | 'cinquieme' | 'quatrieme' | 'troisieme' | 'seconde' | 'premiere-stmg'

/**
 * Represents a level for a math lesson.
 */
export interface Level {
  /**
   * Unique identifier for the level.
   */
  id: LevelId

  /**
   * Name or description of the level.
   */
  name: string

  /**
   * Short representation of the level (eg. 6e).
   */
  short: string

  /**
   * Color associated with the level.
   */
  color: string

  /**
   * Other resources for this level.
   */
  otherResources?: Resource[]
}

/**
 * A resource associated to this level.
 */
export interface Resource {
  /**
   * The resource name.
   */
  name: string
  /**
   * The resource description.
   */
  description: string
  /**
   * The resource URL.
   */
  url: string
}
