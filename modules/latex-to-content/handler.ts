import { storageKey } from './common.ts'

export default defineEventHandler(async (event) => {
  const params = event.context.params
  if (!params?.level) {
    throw createError({ status: 404 })
  }
  let lesson = params.lesson ?? 'index'
  if (!lesson.endsWith('.json')) {
    lesson = lesson += '.json'
  }
  const json = await useStorage(`assets:${storageKey}`).getItem(params.level + '/' + lesson)
  if (!json) {
    throw createError({ status: 404 })
  }
  return json
})
