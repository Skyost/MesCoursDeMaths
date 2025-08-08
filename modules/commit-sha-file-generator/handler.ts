import { storageKey, filename } from './common'
import { defineEventHandler } from 'h3'
import { useStorage } from 'nitropack/runtime/internal/storage'

export default defineEventHandler(async () => {
  return await useStorage(`assets:${storageKey}`).getItem(filename)
})
