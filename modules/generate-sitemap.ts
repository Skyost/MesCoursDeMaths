import fs from 'fs'
import { Readable } from 'stream'
import { dirname } from 'path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { NuxtPage } from '@nuxt/schema'
import fsExtra from 'fs-extra'
import contentGenerator from '../site/content-generator'

export default defineNuxtModule({
  meta: {
    name: 'generate-sitemap',
    version: '0.0.1',
    configKey: 'sitemap',
    compatibility: { nuxt: '^3.0.0' }
  },
  defaults: {
    hostname: 'http://localhost:3000',
    exclude: [],
    include: [],
    generatedUrlsFile: contentGenerator.generatedUrlsFile
  },
  setup (options, nuxt) {
    function generateSitemap (routes: Array<NuxtPage>) {
      const sitemapRoutes = routes
        .filter(route => !options.exclude.includes(route.path) && !route.path.includes(':'))
        .map(route => route.path)
      const generatedUrlsFile = resolver.resolve(nuxt.options.srcDir, options.generatedUrlsFile)
      if (fs.existsSync(generatedUrlsFile)) {
        sitemapRoutes.push(...JSON.parse(fs.readFileSync(generatedUrlsFile, { encoding: 'utf-8' })))
      }
      sitemapRoutes.push(...options.include)

      // https://github.com/ekalinin/sitemap.js#generate-a-one-time-sitemap-from-a-list-of-urls
      const stream = new SitemapStream({ hostname: options.hostname })
      return streamToPromise(Readable.from(sitemapRoutes).pipe(stream)).then(data =>
        data.toString()
      )
    }

    function createSitemapFile (sitemap: string, filepath: string) {
      const dirPath = dirname(filepath)
      fsExtra.mkdirpSync(dirPath)
      fs.writeFileSync(filepath, sitemap)
    }

    const resolver = createResolver(import.meta.url)
    const filePath = resolver.resolve(
      nuxt.options.srcDir,
      'node_modules/.cache/.sitemap/sitemap.xml'
    )

    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    nuxt.options.nitro.publicAssets.push({
      baseURL: '/',
      dir: dirname(filePath)
    })

    nuxt.hook('pages:extend', async (pages) => {
      const sitemap = await generateSitemap(pages)
      createSitemapFile(sitemap, filePath)
    })
  }
})
