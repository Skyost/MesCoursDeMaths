// noinspection ES6PreferShortImport

import fs from 'fs'
import path from 'path'
import { createResolver, defineNuxtModule, type Resolver, useLogger } from '@nuxt/kit'
import { LatexChecksumsCalculator, LatexIncludeCommand, PdfGenerator } from 'that-latex-lib'
import { siteContentSettings, type Variant } from '../site/content'
import { debug } from '../site/debug'
import { getFilename } from '../utils/utils'

/**
 * Options for the PDF generator module.
 */
export interface ModuleOptions {
  directory: string
  previousBuildDirectory: string
  destinationDirectory: string
  generateVariants: (filePath: string, fileContent: string) => null | Variant[]
  ignores: string[]
  getIncludeGraphicsDirectories: (latexFilePath: string) => string[]
  moveFiles: boolean
  renameFile(file: string): string
}

/**
 * The name of the module.
 */
const name = 'latex-pdf-generator'

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
    compatibility: { nuxt: '^3.0.0' },
    configKey: 'latexPdfGenerator'
  },
  defaults: {
    directory: siteContentSettings.downloadDestinations.data + '/' + siteContentSettings.dataLatexDirectory,
    previousBuildDirectory: siteContentSettings.downloadDestinations.previousBuild,
    destinationDirectory: siteContentSettings.latexPdfDestinationDirectory,
    generateVariants: siteContentSettings.generateVariants,
    ignores: siteContentSettings.ignores,
    getIncludeGraphicsDirectories: siteContentSettings.getIncludeGraphicsDirectories,
    moveFiles: !debug,
    renameFile: siteContentSettings.filterFilename
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
      dir: destinationDirectoryPath,
      fallthrough: true
    })
  }
})

/**
 * Recursively generates PDF files from Latex files in a directory.
 *
 * @param resolver The resolver instance.
 * @param directoryPath Absolute path to the directory containing Latex files.
 * @param destinationDirectoryPath Absolute path to the destination directory for generated PDFs.
 * @param ignores List of files to ignore during the generation process.
 * @param previousBuildDirectory Absolute path to the directory containing previous build files.
 * @param options Module options.
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
      logger.info(`Ignored ${filePath}.`)
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
        const variants = options.generateVariants(filePath, content) ?? []
        for (const variant of variants) {
          fs.writeFileSync(filePath, variant.fileContent)
          generateAndCopy(resolver, filePath, previousBuildDirectory, destinationDirectoryPath, options, variant.filename, ` (${variant.type})`)
          fs.writeFileSync(filePath, content)
        }
      }
    }
  }
}

/**
 * Generates and copies a file.
 *
 * @param resolver The resolver instance.
 * @param filePath The file path.
 * @param previousBuildDirectory Absolute path to the directory containing previous build files.
 * @param destinationDirectoryPath Absolute path to the destination directory.
 * @param options Module options.
 * @param destinationFilename The destination directory.
 * @param variant Whether we're generating a variant.
 * @returns Whether the operation is a success.
 */
const generateAndCopy = (
  resolver: Resolver,
  filePath: string,
  previousBuildDirectory: string | null,
  destinationDirectoryPath: string,
  options: ModuleOptions,
  destinationFilename: string | null = null,
  variant: string | null = null
): boolean => {
  logger.info(`Processing "${filePath}"${variant ?? ''}...`)

  // Generate PDF and checksums files.
  const pdfGenerator = new PdfGenerator({
    generateIfExists: !debug,
    checksumsCalculator: new LatexChecksumsCalculator({
      latexIncludeCommands: [
        LatexIncludeCommand.includeGraphics(options.getIncludeGraphicsDirectories(filePath)),
        ...LatexIncludeCommand.defaultLatexIncludeCommands,
        new LatexIncludeCommand(
          'documentclass',
          {
            extensions: ['.cls']
          }
        )
      ]
    })
  })
  const { wasCached, builtFilePath, checksumsFilePath } = pdfGenerator.generate(
    filePath,
    previousBuildDirectory == null ? undefined : previousBuildDirectory,
    options.renameFile(destinationFilename ?? getFilename(filePath))
  )

  // If PDF generation is successful, copy files to the destination directory.
  if (builtFilePath) {
    let parts = path.parse(builtFilePath)
    let filename = destinationFilename ?? parts.name
    const destinationFilePath = resolver.resolve(destinationDirectoryPath, options.renameFile(filename) + parts.ext)
    fs.mkdirSync(destinationDirectoryPath, { recursive: true })
    fs.copyFileSync(builtFilePath, destinationFilePath)

    // Optionally move files instead of copying.
    if (options.moveFiles) {
      fs.unlinkSync(builtFilePath)
    }

    // Copy checksums file if available.
    if (checksumsFilePath) {
      parts = path.parse(checksumsFilePath)
      filename = destinationFilename ?? parts.name
      fs.copyFileSync(checksumsFilePath, resolver.resolve(destinationDirectoryPath, options.renameFile(filename) + parts.ext))

      // Optionally move checksums file instead of copying.
      if (options.moveFiles) {
        fs.unlinkSync(checksumsFilePath)
      }
    }

    if (wasCached) {
      logger.success(`Fully cached PDF found in ${previousBuildDirectory}.`)
    }
    else {
      logger.success(previousBuildDirectory ? `File was not cached in ${previousBuildDirectory} but has been generated with success.` : 'Done.')
    }
    return true
  }
  logger.fatal('Error.')
  return false
}
