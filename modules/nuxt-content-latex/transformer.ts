import path from 'path'
import fs from 'fs'
// @ts-ignore
import { defineTransformer } from '@nuxt/content/transformers'
import { HTMLElement } from 'node-html-parser'
import * as latex from 'that-latex-lib'
import { name } from './common'
import { debug } from '~/site/debug'
import { getFileName, normalizeString } from '~/utils/utils'
import * as logger from '~/utils/logger'
import { siteContentSettings } from '~/site/content'
import type { LinkedResource } from '~/types'

/**
 * Nuxt content transformer for .tex files.
 */
export default defineTransformer({
  name: 'latex',
  extensions: ['.tex'],
  // @ts-ignore
  parse (_id: string, rawContent: string) {
    // Absolute path to the source directory.
    const sourceDirectoryPath = path.resolve('./')

    // Absolute path to the content directory.
    const contentDirectoryPath = path.resolve(sourceDirectoryPath, 'content')

    // Absolute path to the .tex file.
    const filePath = path.resolve(sourceDirectoryPath, _id.replaceAll(':', '/'))
    logger.info(name, `Processing ${filePath}...`)

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
    const root = latex.transformToHtml(
      filePath,
      {
        pandocHeader,
        getExtractedImageCacheDirectoryPath: (_extractedFrom, extractedImageTexFilePath) => path.resolve(sourceDirectoryPath, siteContentSettings.downloadDestinations.previousBuild, path.dirname(path.relative(moduleDataDirectoryPath, extractedImageTexFilePath))),
        getExtractedImageTargetDirectory: (_extractedFrom, assetName) => siteContentSettings.getLatexAssetDestinationDirectoryPath(assetsRootDirectoryPath, assetName, originalTexFilePath),
        assetsRootDirectoryPath,
        getResolvedImageCacheDirectoryPath: resolvedImageTexFilePath => path.resolve(sourceDirectoryPath, siteContentSettings.downloadDestinations.previousBuild, path.dirname(path.relative(moduleDataDirectoryPath, resolvedImageTexFilePath))),
        renderMathElement,
        imagesTemplate: siteContentSettings.picturesTemplate,
        generateIfExists: !debug
      },
      true,
      rawContent
    )

    // Remove empty titles from the HTML content.
    removeEmptyTitles(root)

    // Replace vspace elements in the HTML content.
    replaceVspaceElements(root)

    // Adjust columns size in the HTML content.
    adjustColSize(root)

    logger.success(name, `Successfully processed ${filePath} !`)

    // Return the parsed content object.
    return {
      _id,
      body: root.outerHTML,
      ...getHeader(filePath, root, siteContentSettings.getLinkedResources(sourceDirectoryPath, originalTexFilePath))
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
      } else {
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
 * Renders a given math element.
 * @param {HTMLElement} element The element.
 * @returns {string} The result.
 */
const renderMathElement = (element: HTMLElement): string => latex.renderMathElement(
  element,
  {
    '\\parallelslant': '\\mathbin{\\!/\\mkern-5mu/\\!}',
    '\\ensuremath': '#1',
    '\\dotfillline': '\\htmlClass{dots}{}',
    '\\dotfillsize': '\\htmlStyle{width: #1}{\\dotfillline}'
  },
  math => math
    .replace(/(\\left *|\\right *)*\\VERT/g, '$1 | $1 | $1 |')
    .replace(/\\overset{(.*)}&{(.*)}/g, '&\\overset{$1}{$2}')
)

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
  const parsedFileName = path.parse(filePath).base
  const pdfIndex = linkedResources.findIndex(resource => resource.title === parsedFileName)
  if (pdfIndex !== -1) {
    header.pdf = linkedResourceWithoutPdf[pdfIndex].url
    linkedResourceWithoutPdf.splice(pdfIndex, 1)
  }
  header['linked-resources'] = linkedResourceWithoutPdf

  return header
}
