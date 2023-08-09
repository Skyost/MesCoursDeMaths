import { Level } from '~/types/index'
import { ParsedContent } from '@nuxt/content/dist/runtime/types'

export interface Lesson {
  id: string
  name: string
  number: number
  color: string
  subtitle: string
  url: string
}

export const createLesson = (id: string, name: string, number: number, level: Level): Lesson => {
  return {
    id,
    name,
    number,
    color: level.color,
    subtitle: `Chapitre ${number}`,
    url: `/cours/${level.id}/${id}/`
  }
}

interface LinkedResource {
  title: string,
  url: string
}

export interface LessonContent extends ParsedContent {
  'page-title': string,
  'linked-resources': LinkedResource[],
  url: string
}
