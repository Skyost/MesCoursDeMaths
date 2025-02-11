// noinspection ES6PreferShortImport

import fs from 'fs'
import path from 'path'
import { createResolver, defineNuxtModule, type Resolver, useLogger } from '@nuxt/kit'
import { siteContentSettings } from '../../site/content'
import { name } from './common'

/**
 * The logger instance.
 */
const logger = useLogger(name)

/**
 * Options for this module.
 *
 * @interface
 */
export interface ModuleOptions {
  directory: string
  assetsDestinationDirectoryName: string
  isAsset: (filePath: string) => boolean
  getAssetDestination: (assetDirectoryPath: string, filePath: string) => string
}

/**
 * Nuxt module for transforming .tex files in Nuxt content.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version: '0.0.1',
    configKey: 'nuxtContentLatex',
    compatibility: { nuxt: '^3.0.0' }
  },
  defaults: {
    directory: siteContentSettings.downloadDestinations.data,
    assetsDestinationDirectoryName: siteContentSettings.latexAssetsDestinationDirectory,
    isAsset: siteContentSettings.isAsset,
    getAssetDestination: siteContentSettings.getAssetDestinationDirectoryPath
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Set up Nitro externals for .tex content transformation.
    nuxt.options.nitro.externals = nuxt.options.nitro.externals || {}
    nuxt.options.nitro.externals.inline = nuxt.options.nitro.externals.inline || []
    nuxt.options.nitro.externals.inline.push(resolver.resolve('.'))

    // Register a hook to modify content context and add a transformer for .tex files.
    nuxt.hook('content:context', (contentContext) => {
      contentContext.transformers.push(resolver.resolve('transformer.ts'))
    })

    // Process additional assets such as images.
    const dataDirectory = resolver.resolve(nuxt.options.srcDir, options.directory)
    const assetsDestinationPath = resolver.resolve(nuxt.options.srcDir, 'node_modules', `.${name}`, options.assetsDestinationDirectoryName)
    processAssets(resolver, dataDirectory, assetsDestinationPath, options)

    // Register them in Nitro.
    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    nuxt.options.nitro.publicAssets.push({
      baseURL: `/${options.assetsDestinationDirectoryName}/`,
      dir: assetsDestinationPath,
      fallthrough: true
    })
  }
})

/**
 * Process assets in a directory and copy them to a destination.
 *
 * @param {Resolver} resolver - The Nuxt resolver.
 * @param {string} directoryPath - The path to the source directory containing assets.
 * @param {string} assetsDestinationPath - The path to the destination directory for assets.
 * @param {ModuleOptions} options - Options for transforming LaTeX files.
 */
const processAssets = (
  resolver: Resolver,
  directoryPath: string,
  assetsDestinationPath: string,
  options: ModuleOptions
) => {
  // Get the list of files in the directory.
  const files = fs.readdirSync(directoryPath)

  // Iterate through each file in the directory.
  for (const file of files) {
    const filePath = resolver.resolve(directoryPath, file)

    // If the file is a directory, recursively process its assets.
    if (fs.lstatSync(filePath).isDirectory()) {
      processAssets(resolver, filePath, assetsDestinationPath, options)
      continue
    }

    // Check if the file extension is included in the allowed extensions.
    if (options.isAsset(filePath)) {
      // Calculate the destination path.
      const destinationDirectoryPath = options.getAssetDestination(assetsDestinationPath, filePath)
      const destinationPath = resolver.resolve(destinationDirectoryPath, path.parse(filePath).base)

      // Ensure destination directory exists.
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true })

      if (!fs.existsSync(destinationPath)) {
        // Copy the asset file.
        fs.copyFileSync(filePath, destinationPath)

        // Log the successful copying of an asset file.
        logger.success(`${filePath} -> ${destinationPath}`)
      }
    }
  }
}
