import { createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import defaultOptions, { type ModuleOptions } from './options'
import * as fs from 'fs'
import * as path from 'path'
import type { GradeWithResources } from '../../app/types'

/**
 * The name of the module.
 */
const name = 'latex-bundles-generator'

/**
 * The logger instance.
 */
const logger = useLogger(name)

/**
 * Nuxt module to compile Latex files into PDF.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version: '0.0.1',
    compatibility: { nuxt: '^4.0.0' },
    configKey: 'latexBundlesGenerator'
  },
  defaults: defaultOptions,
  setup: (options, nuxt) => {
    const resolver = createResolver(import.meta.url)
    const rootDirectoryPath = nuxt.options.rootDir

    const dataLatexDirectoryPath = resolver.resolve(
      rootDirectoryPath,
      nuxt.options.contentDownloader.downloadDestinations.data,
      nuxt.options.contentDownloader.dataLatexDirectory
    )

    const readGradeData = nuxt.options.latexToContent.readGradeData

    const files = fs.readdirSync(dataLatexDirectoryPath)
    for (const file of files) {
      const filePath = resolver.resolve(dataLatexDirectoryPath, file)

      // If the file is not a directory, then it cannot be a grade folder.
      if (!fs.lstatSync(filePath).isDirectory()) {
        continue
      }

      // If the file is a directory, then it must be a grade folder.
      const gradeData: GradeWithResources | null = readGradeData(filePath)
      if (!gradeData) {
        continue
      }

      // Read the grade bundles.
      const gradeBundles = options.getGradeBundles(filePath)
      if (gradeBundles.length === 0) {
        logger.log(`No bundle found for grade "${gradeData.id}".`)
      }
      else {
        logger.log(`Found ${gradeBundles.length} bundle(s) for grade "${gradeData.id}".`)
        for (const gradeBundle of gradeBundles) {
          // Construct the grade bundle content.
          let gradeBundlePreamble = ''
          let gradeBundleContent = ''
          for (const part of gradeBundle.parts) {
            const fileContent = fs.readFileSync(part.latexFilePath, { encoding: 'utf8' })
            if (!part.preamble.skip) {
              gradeBundlePreamble += fileContent.substring(part.preamble.beginIndex, part.preamble.endIndex)
            }
            gradeBundleContent += part.before
            if (!part.content.skip) {
              gradeBundleContent += fileContent.substring(part.content.beginIndex, part.content.endIndex)
            }
            gradeBundleContent += part.after
          }
          const gradeBundleLatex = options.bundleLatexTemplate
            .replaceAll('{title}', () => gradeBundle.title)
            .replaceAll('{preamble}', () => gradeBundlePreamble)
            .replaceAll('{content}', () => gradeBundleContent)
          // Write the grade bundle content.
          fs.writeFileSync(gradeBundle.destinationFilePath, gradeBundleLatex)
          logger.success(`Wrote ${path.basename(gradeBundle.destinationFilePath)} content.`)
        }
      }
    }
  }
})
