import * as bootstrapCollapse from 'bootstrap/js/dist/collapse'
import * as bootstrapModal from 'bootstrap/js/dist/modal'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('bootstrap', {
    ...bootstrapCollapse,
    ...bootstrapModal
  })
})
