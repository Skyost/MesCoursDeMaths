import type { Grade, Lesson } from '~/types'

/**
 * Returns the URL to a given grade.
 * @param grade The grade.
 * @returns The grade route.
 */
export const getGradeRoute = (grade: Grade): string => {
  return `/cours/${grade.id}/`
}

/**
 * Returns the URL to a given lesson.
 * @param grade The lesson grade.
 * @param lesson The lesson.
 * @returns The lesson route.
 */
export const getLessonRoute = (grade: Grade, lesson: Lesson): string => {
  return `${getGradeRoute(grade)}${lesson.id}/`
}
