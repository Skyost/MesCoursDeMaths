import path from 'path'
import fs from 'fs'
import { defineTransformer } from '@nuxt/content/transformers'
import type { HTMLElement } from 'node-html-parser'
import { consola } from 'consola'
import { KatexRenderer, LatexImageExtractor, PandocCommand, PandocTransformer, SvgGenerator } from 'that-latex-lib'
import { name } from './common'
import { debug } from '~/site/debug'
import { getFileName, normalizeString } from '~/utils/utils'
import { siteContentSettings } from '~/site/content'
import type { LinkedResource } from '~/types'

/**
 * The logger instance.
 */
const logger = consola.withTag(name)

/**
 * Nuxt content transformer for .tex files.
 */
export default defineTransformer({
  name: 'latex',
  extensions: ['.tex'],
  // @ts-expect-error Pasted from the docs.
  parse(_id: string, rawContent: string) {
    // Absolute path to the source directory.
    const sourceDirectoryPath = path.resolve('./')

    // Absolute path to the content directory.
    const contentDirectoryPath = path.resolve(sourceDirectoryPath, 'content')

    // Absolute path to the .tex file.
    const filePath = path.resolve(sourceDirectoryPath, _id.replaceAll(':', '/'))
    logger.info(`Processing ${filePath}...`)

    // Absolute path to the original Latex file.
    const originalTexFilePath = path.resolve(
      sourceDirectoryPath,
      siteContentSettings.downloadDestinations.data,
      path.relative(contentDirectoryPath, filePath)
    )

    // Extract images from the .tex file content and return the modified content.
    const moduleDataDirectoryPath = path.resolve(sourceDirectoryPath, 'node_modules', `.${name}`)
    const assetsRootDirectoryPath = path.resolve(moduleDataDirectoryPath, siteContentSettings.latexAssetsDestinationDirectory)

    // Load the Pandoc redefinitions header content.
    const pandocHeader = fs.readFileSync(path.resolve(sourceDirectoryPath, siteContentSettings.downloadDestinations.data, siteContentSettings.dataLatexDirectory, siteContentSettings.pandocRedefinitions), { encoding: 'utf8' })

    // Parse the Pandoc HTML output.
    console.log(path.resolve(assetsRootDirectoryPath, path.relative(contentDirectoryPath, filePath)))
    const pandocTransformer = new PandocTransformer({
      imageSrcResolver: PandocTransformer.resolveFromAssetsRoot(
        assetsRootDirectoryPath,
        {
          subdirectories: [
            path.resolve(assetsRootDirectoryPath, path.relative(contentDirectoryPath, filePath))
          ],
          getImageCacheDirectoryPath: resolvedImageTexFilePath => path.resolve(
            sourceDirectoryPath,
            siteContentSettings.downloadDestinations.previousBuild,
            path.dirname(
              path.relative(
                moduleDataDirectoryPath,
                resolvedImageTexFilePath
              )
            )
          )
        }
      ),
      imageExtractors: Object.keys(siteContentSettings.picturesTemplate).map(
        blockType => new TikzPictureImageExtractor(
          blockType,
          sourceDirectoryPath,
          moduleDataDirectoryPath,
          assetsRootDirectoryPath
        )
      ),
      mathRenderer: new KatexRendererWithMacros(),
      pandoc: new PandocCommand({
        header: pandocHeader,
        additionalArguments: ['--shift-heading-level-by=1']
      })
    })
    // Transforms the raw content into HTML.
    const { htmlResult: root } = pandocTransformer.transform(filePath, rawContent)

    if (root) {
      // Remove empty titles from the HTML content.
      removeEmptyTitles(root)

      // Replace vspace elements in the HTML content.
      replaceVspaceElements(root)

      // Adjust columns size in the HTML content.
      adjustColSize(root)

      // Return the parsed content object.
      logger.success(`Successfully processed ${filePath} !`)
      return {
        _id,
        body: root.outerHTML,
        ...getHeader(filePath, root, siteContentSettings.getLinkedResources(sourceDirectoryPath, originalTexFilePath))
      }
    }

    logger.error(`Failed to process ${filePath}.`)
    return {
      _id,
      body: `Unable to parse ${_id}.`
    }
  }
})

/**
 * Remove empty titles (h2, h3, h4) from the HTML root element.
 *
 * @param {HTMLElement} root - The root HTML element.
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
 * @param {HTMLElement} root - The root HTML element.
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
 * @param {HTMLElement} root - The root HTML element.
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
 * @param {string} filePath - The file path of the document.
 * @param {HTMLElement} root - The root HTML element of the document.
 * @param {LinkedResource[]} linkedResources - The resources to link with this document.
 * @returns {{ [key: string]: any }} Header information.
 */
const getHeader = (filePath: string, root: HTMLElement, linkedResources: LinkedResource[]): { [key: string]: any } => {
  // Initialize the header object with the slug.
  const header: { [key: string]: any } = { id: siteContentSettings.filterFileName(getFileName(filePath)) }

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
class TikzPictureImageExtractor extends LatexImageExtractor {
  /**
   * The source directory path.
   */
  sourceDirectoryPath: string
  /**
   * The module data directory path.
   */
  moduleDataDirectoryPath: string
  /**
   * The assets root directory path.
   */
  assetsRootDirectoryPath: string

  /**
   * Creates a new `TikzPictureImageExtractor` instance.
   *
   * @param {string} blockType The image block type.
   * @param {string} sourceDirectoryPath The source directory path.
   * @param {string} moduleDataDirectoryPath The module data directory path.
   * @param {string} assetsRootDirectoryPath The assets root directory path.
   */
  constructor(
    blockType: string,
    sourceDirectoryPath: string,
    moduleDataDirectoryPath: string,
    assetsRootDirectoryPath: string
  ) {
    super(
      blockType,
      {
        svgGenerator: new SvgGenerator({
          generateIfExists: !debug
        })
      }
    )
    this.sourceDirectoryPath = sourceDirectoryPath
    this.moduleDataDirectoryPath = moduleDataDirectoryPath
    this.assetsRootDirectoryPath = assetsRootDirectoryPath
  }

  override getExtractedImageDirectoryPath(extractedFrom: string, extractedFileName: string): string {
    return siteContentSettings.getLatexAssetDestinationDirectoryPath(
      this.assetsRootDirectoryPath,
      extractedFileName,
      extractedFrom
    )
  }

  override getExtractedImageCacheDirectoryPath(extractedFrom: string, extractedImageTexFilePath: string): string | null {
    return path.resolve(
      this.sourceDirectoryPath,
      siteContentSettings.downloadDestinations.previousBuild,
      path.dirname(
        path.relative(
          this.moduleDataDirectoryPath,
          extractedImageTexFilePath
        )
      )
    )
  }

  override renderContent(extractedImageTexFilePath: string, latexContent: string): string {
    return siteContentSettings.picturesTemplate[this.imageType]
      .replace(
        '{graphicsPath}',
        '\\graphicspath{' + siteContentSettings.getIncludeGraphicsDirectories(extractedImageTexFilePath)
          .map(directory => `{${directory.replaceAll('\\', '\\\\')}}`)
          .join('\n') + '}'
      )
      .replace('{extractedContent}', latexContent)
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
