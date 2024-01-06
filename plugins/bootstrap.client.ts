import * as collapse from 'bootstrap/js/dist/collapse'
import * as modal from 'bootstrap/js/dist/modal'

/**
 * Bootstrap plugin for Nuxt.
 *
 * @param {NuxtApp} nuxtApp - The Nuxt app instance.
 */
export default defineNuxtPlugin(nuxtApp => nuxtApp.provide('bootstrap', { collapse, modal }))
