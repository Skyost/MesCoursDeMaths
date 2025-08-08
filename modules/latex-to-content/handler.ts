import { storageKey } from './common'
import { defineEventHandler, createError } from 'h3'
import { useStorage } from 'nitropack/runtime/internal/storage'

export default defineEventHandler(async (event) => {
  const params = event.context.params
  let filePath = 'index.json'
  if (params?.grade) {
    if (params?.lesson) {
      filePath = `${params?.grade}/${params?.lesson}/index.json`
    }
    else {
      filePath = `${params?.grade}/index.json`
    }
  }
  const json = await useStorage(`assets:${storageKey}`).getItem(filePath)
  if (!json) {
    throw createError({ status: 404 })
  }
  return json
})
