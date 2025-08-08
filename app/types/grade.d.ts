import type { Lesson } from '~/types/lesson'

/**
 * Represents the grade of a math lesson.
 */
export interface Grade {
  /**
   * Unique identifier for the grade.
   */
  id: string

  /**
   * Name or description of the grade.
   */
  name: string

  /**
   * Short representation of the grade (eg. 6e).
   */
  short: string

  /**
   * Color associated with the grade.
   */
  color: string
}

/**
 * Represents the grade of a math lesson, with associated resources.
 */
export interface GradeWithResources extends Grade {
  /**
   * Other resources for this grade.
   */
  otherResources: Resource[]
}

/**
 * Represents the grade of a math lesson, with associated resources and lessons.
 */
export interface GradeWithLessons extends GradeWithResources {
  /**
   * The lessons of this grade.
   */
  lessons: Lesson[]
}

/**
 * A resource associated to this grade.
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
