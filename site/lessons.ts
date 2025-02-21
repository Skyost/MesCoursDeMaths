import type { Lesson } from '~/types'
import { getLevelUrl, levels } from '~/site/levels'

/**
 * Returns the subtitle for a given lesson.
 * @param lesson The lesson.
 * @returns The lesson subtitle.
 */
export const getLessonSubtitle = (lesson: Lesson): string => `Chapitre ${lesson.number}`

/**
 * Returns the URL for a given lesson.
 * @param lesson The lesson.
 * @returns The lesson URL.
 */
export const getLessonUrl = (lesson: Lesson): string => {
  const level = levels[lesson.level]
  return `${getLevelUrl(level)}${lesson.id}/`
}

/**
 * Returns the image URL for a given lesson.
 * @param lesson The lesson.
 * @returns The lesson image URL.
 */
export const getLessonImage = (lesson: Lesson): string => {
  const level = levels[lesson.level]
  return `/images/${level.id}/${lesson.id}-cours/image.svg`
}
