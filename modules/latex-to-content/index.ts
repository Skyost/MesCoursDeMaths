// noinspection ES6PreferShortImport

import fs from 'fs'
import path from 'path'
import { addServerHandler, createResolver, defineNuxtModule, addPrerenderRoutes, useLogger, type Resolver } from '@nuxt/kit'
import { KatexRenderer, LatexImageExtractorInDirectory, PandocCommand, PandocTransformer, SvgGenerator } from 'that-latex-lib'
import type { HTMLElement } from 'node-html-parser'
import debug from '../../app/site/debug'
import { getGradeRoute, getLessonRoute } from '../../app/site/lessons'
import type { Grade, GradeWithResources, Lesson, LessonContent, LinkedResource } from '../../app/types'
import { storageKey } from './common'
import defaultOptions, { type ModuleOptions } from './options'
import type { ModuleOptions as ContentDownloaderModuleOptions } from '../content-downloader/options'
import type { ModuleOptions as LatexPdfGeneratorModuleOptions } from '../latex-pdf-generator/options'
import { defu } from 'defu'
import NodeType from 'node-html-parser/dist/nodes/type'

/**
 * The name of this module.
 */
const name = 'latex-to-content'

/**
 * The logger instance.
 */
const logger = useLogger(name)

/**
 * Nuxt module for transforming .tex files in Nuxt content.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version: '0.0.1',
    configKey: 'latexToContent',
    compatibility: { nuxt: '^4.0.0' }
  },
  defaults: defaultOptions,
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const rootDirectoryPath = nuxt.options.rootDir

    // Process additional assets such as images.
    const dataDirectoryPath = resolver.resolve(rootDirectoryPath, nuxt.options.contentDownloader.downloadDestinations.data)
    const moduleDirectoryPath = resolver.resolve(rootDirectoryPath, 'node_modules', `.${name}`)
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
    const dataLatexDirectory = nuxt.options.contentDownloader.dataLatexDirectory
    const latexDestinationPath = resolver.resolve(moduleDirectoryPath, dataLatexDirectory)
    await processGrades(
      resolver,
      rootDirectoryPath,
      resolver.resolve(dataDirectoryPath, dataLatexDirectory),
      latexDestinationPath,
      options,
      nuxt.options.contentDownloader,
      nuxt.options.latexPdfGenerator
    )
    nuxt.options.nitro.publicAssets.push({
      baseURL: `${options.latexFilesUrl}${dataLatexDirectory}/`,
      dir: latexDestinationPath,
      fallthrough: true
    })
    nuxt.options.nitro.serverAssets = nuxt.options.nitro.serverAssets || []
    nuxt.options.nitro.serverAssets.push({
      baseName: storageKey,
      dir: latexDestinationPath
    })
    addServerHandler({
      route: `${options.latexFilesUrl}${dataLatexDirectory}/`,
      handler: resolver.resolve(`./handler.ts`)
    })
    addServerHandler({
      route: `${options.latexFilesUrl}${dataLatexDirectory}/:grade`,
      handler: resolver.resolve(`./handler.ts`)
    })
    addServerHandler({
      route: `${options.latexFilesUrl}${dataLatexDirectory}/:grade/:lesson`,
      handler: resolver.resolve(`./handler.ts`)
    })
    logger.success(`Pointing "${options.latexFilesUrl}${dataLatexDirectory}/" to "${latexDestinationPath}".`)
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
 * Processes grade directories, transforms grade data, and writes the processed information into JSON files.
 *
 * @param resolver - Provides methods for resolving file and directory paths.
 * @param rootDirectoryPath - The root directory path from which the grade data processing begins.
 * @param directoryPath - The directory path containing the grade folders to process.
 * @param targetDirectoryPath - The directory path where the processed JSON files will be saved.
 * @param options - Configuration options for processing grades, including methods to read and manage grade data.
 * @param contentDownloaderOptions The options of the content downloader module.
 * @param latexPdfGeneratorOptions The options of the PDF generator module.
 */
const processGrades = async (
  resolver: Resolver,
  rootDirectoryPath: string,
  directoryPath: string,
  targetDirectoryPath: string,
  options: ModuleOptions,
  contentDownloaderOptions: ContentDownloaderModuleOptions,
  latexPdfGeneratorOptions: LatexPdfGeneratorModuleOptions
): Promise<void> => {
  // Contains all grades.
  const gradesData: {
    grade: GradeWithResources
    transformed: LessonContent[]
  }[] = []

  // Get the list of files in the directory.
  const files = fs.readdirSync(directoryPath)

  // Iterate through each file in the directory.
  for (const file of files) {
    const filePath = resolver.resolve(directoryPath, file)

    // If the file is not a directory, then it cannot be a grade folder.
    if (!fs.lstatSync(filePath).isDirectory()) {
      continue
    }

    // Try to read the grade data, and if it's a success, then we add it to the list.
    const grade = options.readGradeData(filePath)
    if (grade) {
      const transformed = await processGradeFiles(
        resolver,
        rootDirectoryPath,
        filePath,
        resolver.resolve(targetDirectoryPath, file),
        options,
        contentDownloaderOptions,
        latexPdfGeneratorOptions
      )
      gradesData.push({ grade, transformed })
    }
  }

  // Then we can write all corresponding JSON files.
  const grades: Grade[] = []
  for (const { grade: gradeWithResources, transformed: lessonContents } of gradesData) {
    const gradeTargetDirectoryPath = resolver.resolve(targetDirectoryPath, gradeWithResources.id)

    const lessons: Lesson[] = []
    for (const lessonContent of lessonContents) {
      const lessonDirectoryPath = resolver.resolve(gradeTargetDirectoryPath, lessonContent.id)
      fs.mkdirSync(lessonDirectoryPath, { recursive: true })

      const lessonFilePath = resolver.resolve(lessonDirectoryPath, 'index.json')
      fs.writeFileSync(lessonFilePath, JSON.stringify(lessonContent))

      const { body, linkedResources, ...lesson } = lessonContent
      lessons.push(lesson)

      addPrerenderRoutes(getLessonRoute(gradeWithResources, lesson))
    }

    lessons.sort((a, b) => a.number - b.number)
    const gradeFilePath = resolver.resolve(gradeTargetDirectoryPath, 'index.json')
    fs.writeFileSync(gradeFilePath, JSON.stringify({ ...gradeWithResources, lessons }))

    const { otherResources, ...grade } = gradeWithResources
    grades.push(grade)

    addPrerenderRoutes(getGradeRoute(grade))
  }

  grades.sort((a, b) => b.short.localeCompare(a.short))
  const indexFilePath = resolver.resolve(targetDirectoryPath, 'index.json')
  fs.writeFileSync(indexFilePath, JSON.stringify(grades))
}

/**
 * Process all Latex files of a given directory.
 *
 * @param resolver The Nuxt resolver.
 * @param rootDirectoryPath The Nuxt root directory path.
 * @param gradeDirectoryPath The directory where the Latex files are stored.
 * @param targetDirectoryPath Where to put the transformed files.
 * @param options The module option.
 * @param contentDownloaderOptions The options of the content downloader module.
 * @param latexPdfGeneratorOptions The options of the PDF generator module.
 * @returns The list of transformed files.
 */
const processGradeFiles = async (
  resolver: Resolver,
  rootDirectoryPath: string,
  gradeDirectoryPath: string,
  targetDirectoryPath: string,
  options: ModuleOptions,
  contentDownloaderOptions: ContentDownloaderModuleOptions,
  latexPdfGeneratorOptions: LatexPdfGeneratorModuleOptions
): Promise<LessonContent[]> => {
  // Get the list of files in the directory.
  const files = fs.readdirSync(gradeDirectoryPath)

  // The transformed files.
  const transformed: LessonContent[] = []

  // Iterate through each file in the directory.
  for (const file of files) {
    const filePath = resolver.resolve(gradeDirectoryPath, file)

    // If the file should be transformed, we transform it, and we add it to the list.
    if (fs.lstatSync(filePath).isFile() && options.shouldBeTransformed(filePath)) {
      const result = await transformLatexFile(
        resolver,
        rootDirectoryPath,
        filePath,
        targetDirectoryPath,
        options,
        contentDownloaderOptions,
        latexPdfGeneratorOptions
      )
      if (result) {
        transformed.push(result)
      }
    }
  }
  return transformed
}

/**
 * Processes a given Latex file to transform it into HTML.
 *
 * @param resolver The Nuxt resolver.
 * @param rootDirectoryPath The Nuxt root directory path.
 * @param filePath The path to the file.
 * @param targetDirectoryPath Where to put the transformed files.
 * @param options The module option.
 * @param contentDownloaderOptions The options of the content downloader module.
 * @param latexPdfGeneratorOptions The options of the PDF generator module.
 */
const transformLatexFile = async (
  resolver: Resolver,
  rootDirectoryPath: string,
  filePath: string,
  targetDirectoryPath: string,
  options: ModuleOptions,
  contentDownloaderOptions: ContentDownloaderModuleOptions,
  latexPdfGeneratorOptions: LatexPdfGeneratorModuleOptions
): Promise<LessonContent | undefined> => {
  // Absolute path to the .tex file.
  logger.info(`Processing ${filePath}...`)
  fs.mkdirSync(targetDirectoryPath, { recursive: true })

  // Extract images from the .tex file content and return the modified content.
  const moduleDataDirectoryPath = resolver.resolve(rootDirectoryPath, 'node_modules', `.${name}`)
  const assetsRootDirectoryPath = resolver.resolve(moduleDataDirectoryPath, options.assetsDestinationDirectoryName)
  const latexDirectoryPath = resolver.resolve(rootDirectoryPath, contentDownloaderOptions.downloadDestinations.data, contentDownloaderOptions.dataLatexDirectory)

  // Load the Pandoc redefinitions header content.
  const pandocHeader = fs.readFileSync(resolver.resolve(latexDirectoryPath, options.pandocRedefinitionsFile), { encoding: 'utf8' })

  // Parse the Pandoc HTML output.
  const pandocTransformer = new PandocTransformer({
    imageSrcResolver: PandocTransformer.resolveFromAssetsRoot(
      assetsRootDirectoryPath,
      {
        getImageCacheDirectoryPath: resolvedImageTexFilePath => path.resolve(
          rootDirectoryPath,
          contentDownloaderOptions.downloadDestinations.previousBuild,
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
        options.picturesTemplate[blockType]!,
        options.getLatexFileAssetsDestinationDirectoryPath(assetsRootDirectoryPath, filePath),
        latexPdfGeneratorOptions.getIncludeGraphicsDirectories,
        latexDirectoryPath,
        moduleDataDirectoryPath,
        resolver.resolve(rootDirectoryPath, contentDownloaderOptions.downloadDestinations.previousBuild)
      )
    ),
    mathRenderer: new KatexRendererWithMacros(),
    pandoc: new PandocCommand({
      header: pandocHeader,
      additionalArguments: ['--shift-heading-level-by=1']
    })
  })
  // Transforms the raw content into HTML.
  const { htmlResult: root } = await pandocTransformer.transform(filePath, fs.readFileSync(filePath, { encoding: 'utf8' }))

  let filename = path.parse(filePath).name
  if (root) {
    // Remove empty titles from the HTML content.
    removeEmptyTitles(root)

    // Replace vspace elements in the HTML content.
    replaceVspaceElements(root)

    // Adjust columns size in the HTML content.
    adjustColSize(root)

    // Handle framed images.
    handleFramedImages(root)

    // Handle sources environments.
    handleSources(root)

    // Return the parsed content object.
    filename = latexPdfGeneratorOptions.filterFilename(filename)

    // Get raw linked resources.
    const rawLinkedResources = options.getRawLinkedResources(filePath)

    // And transform them for the header.
    const buildUrl = (latexFilePath: string) => {
      const relativePath = path.relative(path.resolve(rootDirectoryPath, contentDownloaderOptions.downloadDestinations.data, contentDownloaderOptions.dataLatexDirectory), latexFilePath)
      const baseUrl = path.dirname(relativePath).replace('\\', '/')
      return `/${latexPdfGeneratorOptions.destinationDirectoryName}/${baseUrl}/${latexPdfGeneratorOptions.filterFilename(path.parse(latexFilePath).name)}.pdf`
    }
    const header = getHeader(
      filePath,
      root,
      rawLinkedResources.map((resource) => {
        return {
          title: resource.title,
          url: buildUrl(resource.latexFilePath),
          isCurrentFile: resource.isCurrentFile
        }
      })
    )
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
 * Allows to parse Latex's key-value parameters.
 *
 * @param params The parameters to parse.
 * @returns The parsed parameters.
 */
const parseKeyValParams = (params: HTMLElement): Record<string, string> => {
  const result: Record<string, string> = {}
  let currentKey: string | null = null
  for (const node of params.childNodes) {
    if (node.nodeType === NodeType.TEXT_NODE) {
      const matches = [...node.textContent!.matchAll(/([a-zA-Z0-9_]+)\s*=/g)]
      matches.forEach(m => currentKey = m[1]!)
    }
    else if (node.nodeType === NodeType.ELEMENT_NODE && currentKey) {
      result[currentKey] = (node as HTMLElement).outerHTML
      currentKey = null
    }
  }

  return result
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
    const params = row.querySelector('> .params')
    if (columns.length === 2) {
      if (params && params.text.trim().length > 0) {
        const rawWidth = parseKeyValParams(params)?.width
        if (rawWidth) {
          const size = parseFloat(rawWidth)
          columns[0]!.setAttribute('style', `--column-size: ${size};`)
          columns[1]!.setAttribute('style', `--column-size: ${1 - size};`)
        }
      }
    }
    params?.remove()
  }
}

/**
 * Handle framed images.
 *
 * @param root The root HTML element of the document.
 */
const handleFramedImages = (root: HTMLElement) => {
  const framed = root.querySelectorAll('.framed')
  for (const child of framed) {
    if (child.childElementCount === 1 && child.firstElementChild!.tagName === 'P') {
      const p = child.firstElementChild!
      if (p.childElementCount === 1 && p.firstElementChild!.tagName === 'IMG') {
        p.firstElementChild!.classList.add('framed')
        child.replaceWith(p)
      }
    }
  }
}

/**
 * Handle sources environments.
 *
 * @param root The root HTML element of the document.
 */
const handleSources = (root: HTMLElement) => {
  const sources = root.querySelectorAll('.src, .box-src')
  for (const source of sources) {
    const paragraphs = source.querySelectorAll('> p')
    const url = paragraphs[paragraphs.length - 1]!.innerHTML
    let params: Record<string, string> = {}
    if (paragraphs.length === 2) {
      params = parseKeyValParams(paragraphs[0]!)
    }
    params = defu(params, {
      prefix: source.classList.contains('box-src') ? 'D\'après' : 'Source :',
      text: new URL(url).hostname
    })
    source.innerHTML = `<span>${params.prefix} <a href="${encodeURI(url)}">${params.text}</a></span>`
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
    header.pageTitle = title.text.trim()
    header.pageTitleSearch = normalizeString(header.pageTitle)
    title.parentNode.remove()
  }

  // Get and parse chapter number.
  const number = root.querySelector('.docnumber p')
  if (number) {
    header.number = parseInt(number.innerHTML.trim())
    number.parentNode.remove()
  }

  // Get and parse linked resources.
  const linkedResourceWithoutPdf = [...linkedResources]
  const pdfIndex = linkedResources.findIndex(resource => resource.isCurrentFile)
  if (pdfIndex !== -1) {
    header.pdf = linkedResourceWithoutPdf[pdfIndex]!.url
    linkedResourceWithoutPdf.splice(pdfIndex, 1)
  }
  header.linkedResources = linkedResourceWithoutPdf

  return header
}

/**
 * Normalizes a string by removing diacritics and converting to lowercase.
 *
 * @param string Input string.
 * @returns Normalized string.
 */
const normalizeString = (string: string): string => string.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

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
   * @param latexDirectoryPath The Latex directory path.
   * @param moduleDataDirectoryPath The module data directory path.
   * @param previousBuildDirectoryPath The previous build directory path.
   */
  constructor(
    blockType: string,
    template: string,
    destinationDirectoryPath: string,
    getIncludeGraphicsDirectories: (latexFilePath: string) => string[],
    latexDirectoryPath: string,
    moduleDataDirectoryPath: string,
    previousBuildDirectoryPath: string
  ) {
    const preparedTemplate = template.replaceAll('{latexDirectoryPath}', latexDirectoryPath)
    super(
      blockType,
      destinationDirectoryPath,
      (extractedImageTexFilePath: string, latexContent: string) => preparedTemplate
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
  constructor() {
    super(
      {
        macros: {
          '\\parallelslant': '\\mathbin{\\!/\\mkern-5mu/\\!}',
          '\\ensuremath': '#1',
          '\\expandeddotline': '\\htmlClass{dotline}{}',
          '\\sizeddotline': '\\htmlStyle{width: #1}{\\expandeddotline}',
          '\\num': '#1'
        }
      }
    )
  }

  override filterUnknownSymbols(math: string): string {
    const formatNumber = (raw: string): string => {
      const parts = raw.split(/[.,]/)
      parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, '\\;')
      return parts.length > 1 ? `${parts[0]},{${parts[1]}}` : parts[0]
    }
    return super.filterUnknownSymbols(math)
      .replace(/\\num\{([0-9][0-9., ]*)}/g, (_, digits) => formatNumber(digits))
      .replace(/(\\left *|\\right *)*\\VERT/g, '$1 | $1 | $1 |')
      .replace(/\\overset{(.*)}&{(.*)}/g, '&\\overset{$1}{$2}')
      .replaceAll('\\sizeddotline{}', '\\expandeddotline')
  }
}
