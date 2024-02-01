// noinspection ES6PreferShortImport

import fs from 'fs'
import path from 'path'
import { createResolver, defineNuxtModule, type Resolver } from '@nuxt/kit'
import * as latex from 'that-latex-lib'
import * as logger from '../utils/logger'
import { siteContentSettings } from '../site/content'
import { debug } from '../site/debug'
import { getFileName } from '../utils/utils'

/**
 * Options for the PDF generator module.
 *
 * @interface
 */
export interface ModuleOptions {
  directory: string,
  previousBuildDirectory: string,
  destinationDirectory: string,
  generatePrintVariant: (filePath: string, fileContent: string) => null | { name: string, content: string },
  ignores: string[],
  getIncludeGraphicsDirectories: (latexFilePath: string) => string[],
  moveFiles: boolean,
  renameFile(file: string): string
}

/**
 * The name of the module.
 */
const name = 'latex-pdf-generator'

/**
 * Nuxt module to compile Latex files into PDF.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version: '0.0.1',
    compatibility: { nuxt: '^3.0.0' },
    configKey: 'latexPdfGenerator'
  },
  defaults: {
    directory: siteContentSettings.downloadDestinations.data + '/' + siteContentSettings.dataLatexDirectory,
    previousBuildDirectory: siteContentSettings.downloadDestinations.previousBuild,
    destinationDirectory: siteContentSettings.latexPdfDestinationDirectory,
    generatePrintVariant: siteContentSettings.generatePrintVariant,
    ignores: siteContentSettings.ignores,
    getIncludeGraphicsDirectories: siteContentSettings.getIncludeGraphicsDirectories,
    moveFiles: !debug,
    renameFile: siteContentSettings.filterFileName
  },
  setup: (options, nuxt) => {
    const resolver = createResolver(import.meta.url)
    const srcDir = nuxt.options.srcDir
    const directoryPath = resolver.resolve(srcDir, options.directory)
    const previousBuildDirectoryPath = resolver.resolve(srcDir, options.previousBuildDirectory, options.destinationDirectory)
    const destinationDirectoryPath = resolver.resolve(srcDir, 'node_modules', `.${name}`)

    const ignores = options.ignores.map(file => resolver.resolve(srcDir, options.directory, file))
    generatePdf(
      resolver,
      directoryPath,
      destinationDirectoryPath,
      ignores,
      previousBuildDirectoryPath,
      options
    )

    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    nuxt.options.nitro.publicAssets.push({
      baseURL: `/${options.destinationDirectory}/`,
      dir: destinationDirectoryPath
    })
  }
})

/**
 * Recursively generates PDF files from Latex files in a directory.
 *
 * @param {Resolver} resolver The resolver instance.
 * @param {string} directoryPath Absolute path to the directory containing Latex files.
 * @param {string} destinationDirectoryPath Absolute path to the destination directory for generated PDFs.
 * @param {string[]} ignores List of files to ignore during the generation process.
 * @param {string | null} previousBuildDirectory Absolute path to the directory containing previous build files.
 * @param {ModuleOptions} options Module options.
 */
const generatePdf = (
  resolver: Resolver,
  directoryPath: string,
  destinationDirectoryPath: string,
  ignores: string[],
  previousBuildDirectory: string | null,
  options: ModuleOptions
) => {
  // Get a list of files in the current directory.
  const files = fs.readdirSync(directoryPath)

  // Iterate over each file in the directory.
  for (const file of files) {
    const filePath = resolver.resolve(directoryPath, file)

    // Ignore specified files and directories.
    if (ignores.includes(filePath) || !fs.existsSync(filePath)) {
      logger.info(name, `Ignored ${filePath}.`)
      continue
    }

    // If the file is a directory, recursively generate PDFs for its contents.
    if (fs.lstatSync(filePath).isDirectory()) {
      generatePdf(
        resolver,
        filePath,
        resolver.resolve(destinationDirectoryPath, file),
        ignores,
        previousBuildDirectory == null ? null : resolver.resolve(previousBuildDirectory, file),
        options
      )
      continue
    }

    // If the file has a .tex extension, process it to generate a PDF.
    const extension = path.extname(file)
    if (extension === '.tex') {
      const result = generateAndCopy(resolver, filePath, previousBuildDirectory, destinationDirectoryPath, options)
      if (result) {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' })
        const printVariant = options.generatePrintVariant(filePath, content)
        if (printVariant) {
          fs.writeFileSync(filePath, printVariant.content)
          generateAndCopy(resolver, filePath, previousBuildDirectory, destinationDirectoryPath, options, printVariant.name, ' (impression)')
          fs.writeFileSync(filePath, content)
        }
      }
    }
  }
}

/**
 * Generates and copies a file.
 *
 * @param {Resolver} resolver The resolver instance.
 * @param {string} filePath The file path.
 * @param {string | null} previousBuildDirectory Absolute path to the directory containing previous build files.
 * @param {string} destinationDirectoryPath Absolute path to the destination directory.
 * @param {ModuleOptions} options Module options.
 * @param {string | null} destinationFileName The destination directory.
 * @param {string | null} variant Whether we're generating a variant.
 * @return {boolean} Whether the operation is a success.
 */
const generateAndCopy = (
  resolver: Resolver,
  filePath: string,
  previousBuildDirectory: string | null,
  destinationDirectoryPath: string,
  options: ModuleOptions,
  destinationFileName: string | null = null,
  variant: string | null = null
): boolean => {
  logger.info(name, `Processing "${filePath}"${variant ?? ''}...`)

  // Generate PDF and checksums files.
  const { wasCached, builtFilePath, checksumsFilePath } = latex.generatePdf(
    filePath,
    {
      includeGraphicsDirectories: options.getIncludeGraphicsDirectories(filePath),
      cacheDirectoryPath: previousBuildDirectory == null ? undefined : previousBuildDirectory,
      cachedFileName: options.renameFile(destinationFileName ?? getFileName(filePath))
    }
  )

  // If PDF generation is successful, copy files to the destination directory.
  if (builtFilePath) {
    let parts = path.parse(builtFilePath)
    let fileName = destinationFileName ?? parts.name
    const destinationFilePath = resolver.resolve(destinationDirectoryPath, options.renameFile(fileName) + parts.ext)
    fs.mkdirSync(destinationDirectoryPath, { recursive: true })
    fs.copyFileSync(builtFilePath, destinationFilePath)

    // Optionally move files instead of copying.
    if (options.moveFiles) {
      fs.unlinkSync(builtFilePath)
    }

    // Copy checksums file if available.
    if (checksumsFilePath) {
      parts = path.parse(checksumsFilePath)
      fileName = destinationFileName ?? parts.name
      fs.copyFileSync(checksumsFilePath, resolver.resolve(destinationDirectoryPath, options.renameFile(fileName) + parts.ext))

      // Optionally move checksums file instead of copying.
      if (options.moveFiles) {
        fs.unlinkSync(checksumsFilePath)
      }
    }

    if (wasCached) {
      logger.success(name, `Fully cached PDF found in ${previousBuildDirectory}.`)
    } else {
      logger.success(name, previousBuildDirectory ? `File was not cached in ${previousBuildDirectory} but has been generated with success.` : 'Done.')
    }
    return true
  }
  logger.fatal(name, 'Error.')
  return false
}
