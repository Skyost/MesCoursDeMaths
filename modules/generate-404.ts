import * as fs from 'fs'
import { createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'generate-404',
    version: '0.0.1',
    compatibility: { nuxt: '^3.0.0-rc.9' }
  },
  setup: (_, nuxt) => {
    const resolver = createResolver(import.meta.url)
    const filePath = resolver.resolve(nuxt.options.srcDir, 'pages/erreur-404.vue')
    if (fs.existsSync(filePath)) {
      // nuxt.options.generate.fallback = '404.html'
      extendPages((pages) => {
        pages.push({
          name: 'erreur-404',
          path: '/erreur-404.html',
          file: filePath
        })
      })

      nuxt.hook('close', (nuxt) => {
        fs.renameSync(resolver.resolve(nuxt.options.srcDir, 'dist', 'erreur-404.html'), resolver.resolve(nuxt.options.srcDir, 'dist', '404.html'))
      })
    }
  }
})
