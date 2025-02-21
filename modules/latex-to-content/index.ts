// noinspection ES6PreferShortImport

import fs from 'fs'
import path from 'path'
import {
  addServerHandler,
  createResolver,
  defineNuxtModule,
  addPrerenderRoutes,
  type Resolver,
  useLogger
} from '@nuxt/kit'
import { KatexRenderer, LatexImageExtractorInDirectory, PandocCommand, PandocTransformer, SvgGenerator } from 'that-latex-lib'
import type { HTMLElement } from 'node-html-parser'
import { siteContentSettings } from '../../site/content'
import { debug } from '../../site/debug'
import type { LessonContent, LinkedResource } from '../../types'
import { getFilename, normalizeString } from '../../utils/utils.ts'
import { storageKey } from './common.ts'

/**
 * The name of this module.
 */
const name = 'latex-to-content'

/**
 * The logger instance.
 */
const logger = useLogger(name)

/**
 * Options for this module.
 */
export interface ModuleOptions {
  downloadDestinations: {
    previousBuild: string
    data: string
  }
  dataLatexDirectory: string
  assetsDestinationDirectoryName: string
  isAsset: (filePath: string) => boolean
  getLatexFileAssetsDestinationDirectoryPath: (assetDirectoryPath: string, latexFilePath: string) => string
  getAssetDestinationDirectoryPath: (assetDirectoryPath: string, filePath: string) => string
  getIncludeGraphicsDirectories: (latexFilePath: string) => string[]
  shouldBeTransformed: (filePath: string) => boolean
  filterFilename(file: string): string
  pandocRedefinitionsFile: string
  picturesTemplate: { [key: string]: string }
  getLinkedResources: (sourceDirectoryPath: string, latexFilePath: string) => LinkedResource[]
  latexFilesUrl: string
}

/**
 * Nuxt module for transforming .tex files in Nuxt content.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version: '0.0.1',
    configKey: 'latexToContent',
    compatibility: { nuxt: '^3.0.0' }
  },
  defaults: {
    downloadDestinations: siteContentSettings.downloadDestinations,
    dataLatexDirectory: siteContentSettings.dataLatexDirectory,
    assetsDestinationDirectoryName: siteContentSettings.latexAssetsDestinationDirectoryName,
    isAsset: siteContentSettings.isAsset,
    getLatexFileAssetsDestinationDirectoryPath: siteContentSettings.getLatexFileAssetsDestinationDirectoryPath,
    getIncludeGraphicsDirectories: siteContentSettings.getIncludeGraphicsDirectories,
    getAssetDestinationDirectoryPath: siteContentSettings.getAssetDestinationDirectoryPath,
    shouldBeTransformed: siteContentSettings.shouldBeTransformed,
    filterFilename: siteContentSettings.filterFilename,
    pandocRedefinitionsFile: siteContentSettings.pandocRedefinitionsFile,
    picturesTemplate: siteContentSettings.picturesTemplate,
    getLinkedResources: siteContentSettings.getLinkedResources,
    latexFilesUrl: '/_api/'
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const sourceDirectoryPath = nuxt.options.srcDir

    // Set up Nitro externals for .tex content transformation.
    nuxt.options.nitro.externals = nuxt.options.nitro.externals || {}
    nuxt.options.nitro.externals.inline = nuxt.options.nitro.externals.inline || []
    nuxt.options.nitro.externals.inline.push(resolver.resolve('.'))

    // Process additional assets such as images.
    const dataDirectoryPath = resolver.resolve(sourceDirectoryPath, options.downloadDestinations.data)
    const moduleDirectoryPath = resolver.resolve(sourceDirectoryPath, 'node_modules', `.${name}`)
    const assetsDestinationPath = resolver.resolve(moduleDirectoryPath, options.assetsDestinationDirectoryName)
    processAssets(resolver, dataDirectoryPath, assetsDestinationPath, options)

    // Register them in Nitro.
    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    nuxt.options.nitro.publicAssets.push({
      baseURL: `/${options.assetsDestinationDirectoryName}/`,
      dir: assetsDestinationPath,
      fallthrough: true
    })
    logger.success(`Pointing "/${options.assetsDestinationDirectoryName}/" to "${assetsDestinationPath}".`)

    // Transforms .tex files into content for Nuxt.
    const latexDestinationPath = resolver.resolve(moduleDirectoryPath, options.dataLatexDirectory)
    processLatexFiles(resolver, sourceDirectoryPath, resolver.resolve(dataDirectoryPath, options.dataLatexDirectory), latexDestinationPath, options)
    nuxt.options.nitro.publicAssets.push({
      baseURL: `${options.latexFilesUrl}${options.dataLatexDirectory}/`,
      dir: latexDestinationPath,
      fallthrough: true
    })
    nuxt.options.nitro.serverAssets = nuxt.options.nitro.serverAssets || []
    nuxt.options.nitro.serverAssets.push({
      baseName: storageKey,
      dir: latexDestinationPath
    })
    addServerHandler({
      route: `${options.latexFilesUrl}${options.dataLatexDirectory}/:level`,
      handler: resolver.resolve(`./handler.ts`)
    })
    addServerHandler({
      route: `${options.latexFilesUrl}${options.dataLatexDirectory}/:level/:lesson`,
      handler: resolver.resolve(`./handler.ts`)
    })
    logger.success(`Pointing "${options.latexFilesUrl}${options.dataLatexDirectory}/" to "${latexDestinationPath}".`)
  }
})

/**
 * Process assets in a directory and copy them to a destination.
 *
 * @param resolver The Nuxt resolver.
 * @param directoryPath The path to the source directory containing assets.
 * @param assetsDestinationPath The path to the destination directory for assets.
 * @param options Options for transforming LaTeX files.
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
      const destinationDirectoryPath = options.getAssetDestinationDirectoryPath(assetsDestinationPath, filePath)
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

/**
 * Process all Latex files of a given directory.
 *
 * @param resolver The Nuxt resolver.
 * @param sourceDirectoryPath The Nuxt source directory path.
 * @param directoryPath The directory where the Latex files are stored.
 * @param targetDirectoryPath Where to put the processed files.
 * @param options The module option.
 */
const processLatexFiles = (
  resolver: Resolver,
  sourceDirectoryPath: string,
  directoryPath: string,
  targetDirectoryPath: string,
  options: ModuleOptions
) => {
  // Get the list of files in the directory.
  const files = fs.readdirSync(directoryPath)

  // Iterate through each file in the directory.
  const index = []
  for (const file of files) {
    const filePath = resolver.resolve(directoryPath, file)

    // If the file is a directory, recursively process its assets.
    if (fs.lstatSync(filePath).isDirectory()) {
      processLatexFiles(resolver, sourceDirectoryPath, filePath, resolver.resolve(targetDirectoryPath, file), options)
      continue
    }

    if (options.shouldBeTransformed(filePath)) {
      const result = processLatexFile(resolver, sourceDirectoryPath, filePath, targetDirectoryPath, options)
      if (result) {
        fs.writeFileSync(
          resolver.resolve(targetDirectoryPath, `${result.id}.json`),
          JSON.stringify(result)
        )
        const { body, 'linked-resources': _, ...indexObject } = result
        index.push(indexObject)
      }
    }
  }
  if (index.length > 0) {
    fs.writeFileSync(
      resolver.resolve(targetDirectoryPath, `index.json`),
      JSON.stringify(index)
    )
    for (const page of index) {
      addPrerenderRoutes(`/cours/${page.level}/${page.id}/`)
    }
    addPrerenderRoutes(`/cours/${index[0].level}/`)
  }
}

/**
 * Progress a given Latex file to transform it into HTML.
 *
 * @param resolver The Nuxt resolver.
 * @param sourceDirectoryPath The Nuxt source directory path.
 * @param filePath The path to the file.
 * @param targetDirectoryPath Where to put the processed files.
 * @param options The module option.
 */
const processLatexFile = (
  resolver: Resolver,
  sourceDirectoryPath: string,
  filePath: string,
  targetDirectoryPath: string,
  options: ModuleOptions
): LessonContent | undefined => {
  // Absolute path to the .tex file.
  logger.info(`Processing ${filePath}...`)
  fs.mkdirSync(targetDirectoryPath, { recursive: true })

  // Extract images from the .tex file content and return the modified content.
  const moduleDataDirectoryPath = resolver.resolve(sourceDirectoryPath, 'node_modules', `.${name}`)
  const assetsRootDirectoryPath = resolver.resolve(moduleDataDirectoryPath, options.assetsDestinationDirectoryName)

  // Load the Pandoc redefinitions header content.
  const pandocHeader = fs.readFileSync(
    resolver.resolve(
      sourceDirectoryPath,
      options.downloadDestinations.data,
      options.dataLatexDirectory,
      options.pandocRedefinitionsFile
    ),
    { encoding: 'utf8' }
  )

  // Parse the Pandoc HTML output.
  const pandocTransformer = new PandocTransformer({
    imageSrcResolver: PandocTransformer.resolveFromAssetsRoot(
      assetsRootDirectoryPath,
      {
        getImageCacheDirectoryPath: resolvedImageTexFilePath => path.resolve(
          sourceDirectoryPath,
          options.downloadDestinations.previousBuild,
          path.dirname(
            path.relative(
              moduleDataDirectoryPath,
              resolvedImageTexFilePath
            )
          )
        )
      }
    ),
    imageExtractors: Object.keys(options.picturesTemplate).map(
      blockType => new TikzPictureImageExtractor(
        blockType,
        options.picturesTemplate[blockType],
        options.getLatexFileAssetsDestinationDirectoryPath(assetsRootDirectoryPath, filePath),
        options.getIncludeGraphicsDirectories,
        resolver.resolve(sourceDirectoryPath, options.downloadDestinations.previousBuild),
        moduleDataDirectoryPath
      )
    ),
    mathRenderer: new KatexRendererWithMacros(),
    pandoc: new PandocCommand({
      header: pandocHeader,
      additionalArguments: ['--shift-heading-level-by=1']
    })
  })
  // Transforms the raw content into HTML.
  const { htmlResult: root } = pandocTransformer.transform(filePath, fs.readFileSync(filePath, { encoding: 'utf8' }))

  let filename = getFilename(filePath)
  if (root) {
    // Remove empty titles from the HTML content.
    removeEmptyTitles(root)

    // Replace vspace elements in the HTML content.
    replaceVspaceElements(root)

    // Adjust columns size in the HTML content.
    adjustColSize(root)

    // Return the parsed content object.
    filename = options.filterFilename(filename)
    const header = getHeader(filePath, root, options.getLinkedResources(sourceDirectoryPath, filePath))
    logger.success(`Successfully processed ${filePath} !`)
    return {
      id: filename,
      body: root.outerHTML,
      ...header
    } as LessonContent
  }
  else {
    logger.error(`Failed to process ${filePath}.`)
  }
}

/**
 * Remove empty titles (h2, h3, h4) from the HTML root element.
 *
 * @param root The root HTML element.
 */
const removeEmptyTitles = (root: HTMLElement) => {
  const bubbleTitles = root.querySelectorAll('h2, h3, h4')
  for (const bubbleTitle of bubbleTitles) {
    // Check if the text content of the title is empty and remove it.
    if (bubbleTitle.text.trim().length === 0) {
      bubbleTitle.remove()
    }
  }
}

/**
 * Replace vertical space elements with corresponding styles.
 *
 * @param root The root HTML element.
 */
const replaceVspaceElements = (root: HTMLElement) => {
  const vspaces = root.querySelectorAll('.vertical-space')
  for (const vspace of vspaces) {
    // Get the trimmed text content.
    const text = vspace.text.trim()

    // Check if the text starts with '-' and remove the element.
    if (text.startsWith('-')) {
      vspace.remove()
      continue
    }

    // Set the 'style' attribute to control the height.
    vspace.setAttribute('style', `height: ${text};`)
    vspace.innerHTML = ''
  }
}

/**
 * Adjust columns size.
 *
 * @param root The root HTML element.
 */
const adjustColSize = (root: HTMLElement) => {
  const rows = root.querySelectorAll('.row')
  for (const row of rows) {
    const columns = row.querySelectorAll('> .col')
    const sizeElement = row.querySelector('> .first-col-size')
    if (columns.length === 2) {
      if (sizeElement && sizeElement.text.trim().length > 0) {
        const size = parseFloat(sizeElement.text.trim())
        columns[0].setAttribute('style', `--column-size: ${size};`)
        columns[1].setAttribute('style', `--column-size: ${1 - size};`)
      }
      else {
        columns[0].classList.remove('col')
        columns[1].classList.remove('col')
        columns[0].classList.add('col-12')
        columns[1].classList.add('col-12')
        columns[0].classList.add('col-lg-6')
        columns[1].classList.add('col-lg-6')
      }
    }
    sizeElement?.remove()
  }
}

/**
 * Extract header information from the HTML structure of a LaTeX document.
 *
 * @param filePath The file path of the document.
 * @param root The root HTML element of the document.
 * @param linkedResources The resources to link with this document.
 * @returns Header information.
 */
const getHeader = (filePath: string, root: HTMLElement, linkedResources: LinkedResource[]): { [key: string]: any } => {
  // Initialize the header object with the slug.
  const header: { [key: string]: any } = { }

  // Get the document title element.
  const title = root.querySelector('.doctitle p')

  // Populate header with slug and title if available.
  if (title) {
    header.name = title.innerHTML.trim()
    header['page-title'] = title.text.trim()
    header['page-title-search'] = normalizeString(header['page-title'])
  }

  // Get and parse chapter number.
  const number = root.querySelector('.docnumber p')
  if (number) {
    header.number = parseInt(number.innerHTML.trim())
  }

  // Set the level. Remember that lessons should be placed in their level directory.
  header.level = path.basename(path.dirname(filePath))

  // Get and parse linked resources.
  const linkedResourceWithoutPdf = [...linkedResources]
  const pdfIndex = linkedResources.findIndex(resource => resource.isCurrentFile)
  if (pdfIndex !== -1) {
    header.pdf = linkedResourceWithoutPdf[pdfIndex].url
    linkedResourceWithoutPdf.splice(pdfIndex, 1)
  }
  header['linked-resources'] = linkedResourceWithoutPdf

  return header
}

/**
 * Extracts Tikz pictures from a file.
 */
class TikzPictureImageExtractor extends LatexImageExtractorInDirectory {
  /**
   * The module data directory path.
   */
  moduleDataDirectoryPath: string
  /**
   * The previous build directory path.
   */
  previousBuildDirectoryPath: string

  /**
   * Creates a new `TikzPictureImageExtractor` instance.
   *
   * @param blockType The image block type.
   * @param template The current template.
   * @param destinationDirectoryPath The destination directory path.
   * @param getIncludeGraphicsDirectories Function to get directories for `includegraphics` in LaTeX files.
   * @param moduleDataDirectoryPath The module data directory path.
   * @param previousBuildDirectoryPath The previous build directory path.
   */
  constructor(
    blockType: string,
    template: string,
    destinationDirectoryPath: string,
    getIncludeGraphicsDirectories: (latexFilePath: string) => string[],
    moduleDataDirectoryPath: string,
    previousBuildDirectoryPath: string
  ) {
    super(
      blockType,
      destinationDirectoryPath,
      (extractedImageTexFilePath: string, latexContent: string) => template
        .replace(
          '{graphicsPath}',
          '\\graphicspath{' + getIncludeGraphicsDirectories(extractedImageTexFilePath)
            .map(directory => `{${directory.replaceAll('\\', '\\\\')}}`)
            .join('\n') + '}'
        )
        .replace('{extractedContent}', latexContent),
      {
        svgGenerator: new SvgGenerator({
          generateIfExists: !debug
        })
      }
    )
    this.previousBuildDirectoryPath = previousBuildDirectoryPath
    this.moduleDataDirectoryPath = moduleDataDirectoryPath
  }

  override getExtractedImageCacheDirectoryPath(extractedFrom: string, extractedImageTexFilePath: string): string | null {
    return path.resolve(
      this.previousBuildDirectoryPath,
      path.dirname(
        path.relative(
          this.moduleDataDirectoryPath,
          extractedImageTexFilePath
        )
      )
    )
  }
}

/**
 * A math renderer with some custom macros.
 */
class KatexRendererWithMacros extends KatexRenderer {
  override filterUnknownSymbols(math: string): string {
    return super.filterUnknownSymbols(math)
      .replace(/(\\left *|\\right *)*\\VERT/g, '$1 | $1 | $1 |')
      .replace(/\\overset{(.*)}&{(.*)}/g, '&\\overset{$1}{$2}')
  }

  override getMacros() {
    return {
      '\\parallelslant': '\\mathbin{\\!/\\mkern-5mu/\\!}',
      '\\ensuremath': '#1',
      '\\dotfillline': '\\htmlClass{dots}{}',
      '\\dotfillsize': '\\htmlStyle{width: #1}{\\dotfillline}'
    }
  }
}
