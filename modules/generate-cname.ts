import { dirname } from 'path'
import * as fs from 'fs'
import { createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  hostname: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'generate-cname',
    version: '0.0.1',
    configKey: 'cname',
    compatibility: { nuxt: '^3.0.0' }
  },
  defaults: {
    hostname: 'localhost:3000'
  },
  setup: (options, nuxt) => {
    const resolver = createResolver(import.meta.url)
    const filePath = resolver.resolve(nuxt.options.srcDir, 'node_modules/.cache/.cname/CNAME')
    const fileDirectory = dirname(filePath)
    if (!fs.existsSync(fileDirectory)) {
      fs.mkdirSync(fileDirectory, { recursive: true })
    }
    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    nuxt.options.nitro.publicAssets.push({
      baseURL: '/',
      dir: dirname(filePath)
    })
    fs.writeFileSync(filePath, new URL(options.hostname).host)
  }
})
