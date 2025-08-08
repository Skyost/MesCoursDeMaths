import type { Grade, Lesson } from '~/types'

/**
 * Returns the URL for a given grade.
 * @param grade The grade.
 * @returns The grade URL.
 */
export const getGradeUrl = (grade: Grade): string => {
  return `/cours/${grade.id}/`
}

/**
 * Returns the URL for a given lesson.
 * @param grade The lesson grade.
 * @param lesson The lesson.
 * @returns The lesson URL.
 */
export const getLessonUrl = (grade: Grade, lesson: Lesson): string => {
  return `${getGradeUrl(grade)}${lesson.id}/`
}
