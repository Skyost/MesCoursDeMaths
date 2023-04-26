import { execSync } from 'child_process'
import * as fs from 'fs'
import { createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  fileName: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'generate-commit-sha-file',
    version: '0.0.1',
    configKey: 'commitShaFileGenerator',
    compatibility: { nuxt: '^3.0.0' }
  },
  defaults: {
    fileName: 'latest-commit.json'
  },
  setup: (options, nuxt) => {
    const resolver = createResolver(import.meta.url)
    const srcDir = nuxt.options.srcDir
    const long = execSync('git rev-parse HEAD', { cwd: srcDir }).toString().trim()
    const short = execSync('git rev-parse --short HEAD', { cwd: srcDir }).toString().trim()
    fs.writeFileSync(resolver.resolve(srcDir, 'content', options.fileName), JSON.stringify({ long, short }))
  }
})
