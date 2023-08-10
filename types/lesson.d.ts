import { Level } from '~/types/index'
import { ParsedContent } from '@nuxt/content/dist/runtime/types'

export interface Lesson {
  id: string
  name: string
  number: number
  color: string
  subtitle: string
  url: string
  pdf: string
}

export const createLesson = (id: string, name: string, number: number, level: Level): Lesson => {
  return {
    id,
    name,
    number,
    color: level.color,
    subtitle: `Chapitre ${number}`,
    url: `${level.url}${id}/`,
    pdf: `/pdf/${level.id}/${id}.pdf`
  }
}

interface LinkedResource {
  title: string,
  url: string
}

export interface LessonContent extends ParsedContent {
  slug: angles
  name: Angles
  'page-title': string,
  'page-title-search': string
  number: number
  'linked-resources': LinkedResource[]
}
