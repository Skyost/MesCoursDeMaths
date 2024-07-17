import type { LevelId } from '~/types/level'

/**
 * Represents a linked resource associated with a lesson.
 * @interface
 */
interface LinkedResource {
  /**
   * Title of the linked resource.
   */
  title: string
  /**
   * URL pointing to the resource.
   */
  url: string
  /**
   * Whether the linked resource represents the current lesson.
   * Only the first is taken into account.
   */
  isCurrentFile?: boolean
}

/**
 * Represents the main structure of a math lesson.
 * @interface
 * @export
 */
export interface Lesson {
  /**
   * Identifier for the lesson.
   */
  'id': string
  /**
   * Name or title of the lesson.
   */
  'name': string
  /**
   * Lesson number (chapter).
   */
  'number': number
  /**
   * Level of the lesson.
   */
  'level': LevelId
  /**
   * Title used for the webpage.
   */
  'page-title': string
  /**
   * Title used for webpage search purposes.
   */
  'page-title-search': string
  /**
   * Array of linked resources.
   */
  'linked-resources': LinkedResource[]
  /**
   * Optional PDF file associated with the lesson.
   */
  'pdf'?: string
}

/**
 * Represents a math lesson with additional content.
 * @interface
 * @extends {Lesson}
 */
export interface LessonContent extends Lesson {
  /**
   * The main content or body of the lesson (in HTML format).
   */
  body: string
}
