import { defu } from 'defu'
import commitShaFileGeneratorOptions from './commit-sha-file-generator/options'
import contentDownloaderOptions from './content-downloader/options'
import latexPdfGeneratorOptions from './latex-pdf-generator/options'
import latexToContentOptions from './latex-to-content/options'
import { defineNuxtModule, useLogger } from '@nuxt/kit'

/**
 * The name of the registerer module.
 */
export const name = 'default-options-registerer'

/**
 * The logger instance.
 */
const logger = useLogger(name)

/**
 * Nuxt module to register default options for the custom modules of this app so they can depend on each others.
 */
export default defineNuxtModule((options, nuxt) => {
  logger.info('Registering default options...')
  nuxt.options.commitShaFileGenerator = defu(nuxt.options.commitShaFileGenerator, commitShaFileGeneratorOptions)
  nuxt.options.contentDownloader = defu(nuxt.options.contentDownloader, contentDownloaderOptions)
  nuxt.options.latexPdfGenerator = defu(nuxt.options.latexPdfGenerator, latexPdfGeneratorOptions)
  nuxt.options.latexToContent = defu(nuxt.options.latexToContent, latexToContentOptions)
  logger.success('Done.')
})
