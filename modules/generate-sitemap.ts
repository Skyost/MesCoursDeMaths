import {writeFileSync} from 'fs'
import {Readable} from 'stream'
import {dirname} from 'path'
import mkdirp from 'mkdirp'
import {SitemapStream, streamToPromise} from 'sitemap'
import {createResolver, defineNuxtModule} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'generate-sitemap',
    version: '0.0.1',
    configKey: 'sitemap',
    compatibility: { nuxt: '^3.0.0-rc.9' }
  },
  defaults: {
    hostname: 'http://localhost:3000',
    exclude: []
  },
  setup (options, nuxt) {
    function generateSitemap (routes) {
      const sitemapRoutes = routes
        .filter(route => !options.exclude.includes(route.path))
        .map(route => route.path)

      // https://github.com/ekalinin/sitemap.js#generate-a-one-time-sitemap-from-a-list-of-urls
      const stream = new SitemapStream({ hostname: options.hostname })
      return streamToPromise(Readable.from(sitemapRoutes).pipe(stream)).then(data =>
        data.toString()
      )
    }

    function createSitemapFile (sitemap, filepath) {
      const dirPath = dirname(filepath)
      mkdirp.sync(dirPath)
      writeFileSync(filepath, sitemap)
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
