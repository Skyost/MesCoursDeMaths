import VuePdfEmbed from 'vue-pdf-embed'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('vue-pdf-embed', VuePdfEmbed)
})
