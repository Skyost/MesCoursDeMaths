import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs'
// @ts-ignore
import { defineTransformer } from '@nuxt/content/transformers'
import { HTMLElement, parse } from 'node-html-parser'
import katex from 'katex'
import { createResolver, type Resolver } from '@nuxt/kit'
import { name } from './index'
import { getFileName, normalizeString } from '~/utils/utils'
import * as latex from '~/utils/latex'
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
    // Resolver for creating absolute paths.
    const resolver = createResolver(import.meta.url)

    // Absolute path to the source directory.
    const sourceDirectoryPath = path.resolve('./')

    // Absolute path to the content directory.
    const contentDirectoryPath = resolver.resolve(sourceDirectoryPath, 'content')

    // Absolute path to the .tex file.
    const filePath = resolver.resolve(sourceDirectoryPath, _id.replaceAll(':', '/'))
    logger.info(name, `Processing ${filePath}...`)

    // Absolute path to the original Latex file.
    const originalTexFilePath = resolver.resolve(
      sourceDirectoryPath,
      siteContentSettings.downloadDestinations.data,
      path.relative(contentDirectoryPath, filePath)
    )

    // Extract images from the .tex file content and return the modified content.
    const moduleDataDirectoryPath = resolver.resolve(sourceDirectoryPath, 'node_modules', `.${name}`)
    const assetsDirectoryPath = resolver.resolve(moduleDataDirectoryPath, siteContentSettings.latexAssetsDestinationDirectory)
    const content = extractImages(
      resolver,
      rawContent,
      (assetName: string) => siteContentSettings.getLatexAssetDestination(assetsDirectoryPath, assetName, originalTexFilePath),
      filePath,
      sourceDirectoryPath,
      moduleDataDirectoryPath
    )

    // Load the Pandoc redefinitions header content.
    const pandocHeader = fs.readFileSync(resolver.resolve(sourceDirectoryPath, siteContentSettings.downloadDestinations.data, siteContentSettings.dataLatexDirectory, siteContentSettings.pandocRedefinitions), { encoding: 'utf8' })

    // Run Pandoc to convert the .tex content to HTML.
    const pandocResult = spawnSync(
      'pandoc',
      [
        '-f',
        'latex-auto_identifiers',
        '-t',
        'html',
        '--shift-heading-level-by=1',
        '--gladtex',
        '--html-q-tags'
      ],
      {
        env: process.env,
        cwd: path.resolve(path.dirname(filePath)),
        encoding: 'utf8',
        input: pandocHeader + content
      }
    )

    // Throw an error if the Pandoc transformation fails.
    if (pandocResult.status !== 0) {
      throw pandocResult.stderr
    }

    // Parse the Pandoc HTML output.
    const root = parse(pandocResult.stdout)

    // Replace images in the HTML content.
    replaceImages(
      resolver,
      root,
      originalTexFilePath,
      filePath,
      assetsDirectoryPath,
      sourceDirectoryPath,
      contentDirectoryPath
    )

    // Remove empty titles from the HTML content.
    removeEmptyTitles(root)

    // Replace vspace elements in the HTML content.
    replaceVspaceElements(root)

    // Adjust columns size in the HTML content.
    adjustColSize(root)

    // Render math elements in the HTML content.
    renderMath(root)

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
 * Extract images from LaTeX content and replace them with HTML-friendly references.
 *
 * @param {Resolver} resolver - The resolver for creating absolute paths.
 * @param {string} latexContent - The content of the LaTeX file.
 * @param {string} getAssetDestinationPath - The function that allows to get the destination path of the asset.
 * @param {string} texFilePath - The absolute path of the LaTeX file.
 * @param {string} sourceDirectoryPath - The absolute path to the source directory.
 * @param {string} moduleDataDirectoryPath - The absolute path to the module data directory.
 * @returns {string} - The modified LaTeX content with HTML-friendly image references.
 */
const extractImages = (
  resolver: Resolver,
  latexContent: string,
  getAssetDestinationPath: (assetName: string) => string,
  texFilePath: string,
  sourceDirectoryPath: string,
  moduleDataDirectoryPath: string
): string => {
  // Clone the original LaTeX content.
  let result = latexContent

  // Process each block type specified in the pictures template.
  for (const blockType of Object.keys(siteContentSettings.picturesTemplate)) {
    // Regular expression to match the block type content in LaTeX.
    const regex = new RegExp(`\\\\begin{${blockType}}([\\s\\S]*?)\\\\end{${blockType}}`, 'sg')

    // Initial match.
    let match = regex.exec(result)

    // Counter for naming extracted images.
    let i = 0

    // Process all matches for the current block type.
    while (match) {
      // Generate a unique filename for the extracted image.
      const fileName = `${blockType}-${(i + 1)}.tex`

      // Destination path for the extracted image LaTeX file.
      const extractedImageTexFilePath = getAssetDestinationPath(fileName)

      // Read the template for the current block type.
      const template = siteContentSettings.picturesTemplate[blockType]

      // Create directories if they don't exist.
      fs.mkdirSync(path.dirname(extractedImageTexFilePath), { recursive: true })

      // Write the template content with the matched block content to the extracted image LaTeX file.
      const includeGraphicsDirectories = siteContentSettings.getIncludeGraphicsDirectories(extractedImageTexFilePath)
      fs.writeFileSync(
        extractedImageTexFilePath,
        template
          .replace('%s', includeGraphicsDirectories
            .map(directory => `\\graphicspath{${directory.replaceAll('\\', '\\\\')}}`)
            .join('\n')
          )
          .replace('%s', match[0])
      )

      // Generate SVG from the extracted image LaTeX file.
      const { builtFilePath } = latex.generateSvg(
        extractedImageTexFilePath,
        {
          includeGraphicsDirectories,
          cacheDirectory: resolver.resolve(sourceDirectoryPath, siteContentSettings.downloadDestinations.previousBuild, path.dirname(path.relative(moduleDataDirectoryPath, extractedImageTexFilePath))),
          optimize: true
        }
      )

      // If SVG is generated successfully, replace the LaTeX block with an HTML-friendly image reference.
      if (builtFilePath) {
        logger.success(name, `${blockType}[${(i + 1)}] -> ${builtFilePath} from ${texFilePath}.`)
        result = result.replace(match[0], `\\includegraphics{${path.parse(builtFilePath).base}}`)
        fs.rmSync(extractedImageTexFilePath)
      }

      // Move to the next match.
      match = regex.exec(latexContent)

      // Increment the counter.
      i++
    }

    // Log the number of extracted images for the current block type.
    if (i > 0) {
      logger.success(name, `Extracted ${i} images of type ${blockType} from ${texFilePath}.`)
    }
  }

  // Return the modified LaTeX content.
  return result
}

/**
 * Replace LaTeX image references in the HTML tree with resolved image sources.
 *
 * @param {Resolver} resolver - The resolver for creating absolute paths.
 * @param {HTMLElement} root - The root of the HTML tree.
 * @param {string} originalTexFilePath - The absolute path of the original (not copied) LaTeX file.
 * @param {string} texFilePath - The path of the LaTeX file from the content directory.
 * @param {string} assetsDirectoryPath - The absolute path to the asset directory.
 * @param {string} sourceDirectoryPath - The absolute path to the source directory.
 * @param {string} contentDirectoryPath - The absolute path to the content directory.
 */
const replaceImages = (
  resolver: Resolver,
  root: HTMLElement,
  originalTexFilePath: string,
  texFilePath: string,
  assetsDirectoryPath: string,
  sourceDirectoryPath: string,
  contentDirectoryPath: string
) => {
  // Possible image file extensions.
  const extensions = ['', '.pdf', '.svg', '.png', '.jpeg', '.jpg', '.gif']

  // Select all image elements in the HTML tree.
  const images = root.querySelectorAll('img')

  // Process each image element.
  for (const image of images) {
    // Get the source attribute of the image.
    const src = image.getAttribute('src')

    // Skip if the source attribute is missing.
    if (!src) {
      continue
    }

    // Directories to search for the image.
    const directories = siteContentSettings.getIncludeGraphicsDirectories(originalTexFilePath)

    // Try resolving the image from various directories and extensions.
    for (const directory of directories) {
      let resolved = false

      // Try different file extensions.
      for (const extension of extensions) {
        // Get the destination path of the image in the assets directory.
        const filePath = siteContentSettings.getLatexAssetDestination(
          assetsDirectoryPath,
          directory + '/' + src + extension,
          null
        )

        // Check if the file exists.
        if (fs.existsSync(filePath)) {
          // Resolve the image source.
          const resolvedSrc = resolveImageSrc(
            filePath,
            directories.map(includedGraphicDirectory => resolver.resolve(contentDirectoryPath, includedGraphicDirectory)),
            assetsDirectoryPath,
            resolver.resolve(sourceDirectoryPath, siteContentSettings.downloadDestinations.previousBuild, directory)
          )

          // Format the resolved source as an absolute path.
          if (resolvedSrc) {
            // Update the image source and alt attribute.
            image.setAttribute('src', resolvedSrc)
            image.setAttribute('alt', src)

            resolved = true
            logger.success(name, `Resolved image ${src} to ${resolvedSrc} in ${texFilePath}.`)
            break
          }
        }
      }

      // Break the outer loop if the image is resolved.
      if (resolved) {
        break
      }
    }
  }
}

/**
 * Resolve the source of an image file.
 *
 * @param {string} imagePath - The path to the image file.
 * @param {string[]} includeGraphicsDirectories - Directories for including graphics.
 * @param {string} assetsDestinationDirectoryPath - The destination directory for assets.
 * @param {string} cacheDirectoryPath - The path to the cache directory.
 * @returns {string | null} - The resolved source of the image or null if not resolved.
 */
const resolveImageSrc = (
  imagePath: string,
  includeGraphicsDirectories: string[],
  assetsDestinationDirectoryPath: string,
  cacheDirectoryPath: string
): string | null => {
  // Check if the image has a PDF extension.
  if (path.extname(imagePath) === '.pdf') {
    // Generate an SVG from the PDF.
    const { builtFilePath } = latex.generateSvg(
      imagePath,
      {
        includeGraphicsDirectories,
        cacheDirectory: cacheDirectoryPath,
        optimize: true
      }
    )

    // If the PDF couldn't be converted to SVG, return null.
    if (!builtFilePath) {
      return null
    }

    // Update the image path to the generated SVG.
    imagePath = builtFilePath
  }

  // Return the relative path from the assets destination directory.
  return '/' + path.relative(path.dirname(assetsDestinationDirectoryPath), imagePath).replace(/\\/g, '/')
}

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
 * Render LaTeX math equations using KaTeX and replace corresponding HTML elements.
 *
 * @param {HTMLElement} root - The root HTML element.
 */
const renderMath = (root: HTMLElement) => {
  const mathElements = root.querySelectorAll('eq')
  for (const mathElement of mathElements) {
    // Get the trimmed text content.
    const text = mathElement.text.trim()

    // Replace the math element with the rendered KaTeX HTML.
    mathElement.replaceWith(
      katex.renderToString(text, {
        displayMode: mathElement.getAttribute('env') === 'displaymath', // Determine if it's a display math environment.
        output: 'html',
        trust: true,
        strict: (errorCode: any) => errorCode === 'htmlExtension' ? 'ignore' : 'warn',
        macros: {
          '\\parallelslant': '\\mathbin{\\!/\\mkern-5mu/\\!}',
          '\\ensuremath': '#1',
          '\\dotfillline': '\\htmlClass{dots}{}',
          '\\dotfillsize': '\\htmlStyle{width: #1}{\\dotfillline}'
        }
      })
    )
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
  const parsedFileName = path.parse(filePath).base
  const pdfIndex = linkedResources.findIndex(resource => resource.title === parsedFileName)
  if (pdfIndex !== -1) {
    header.pdf = linkedResourceWithoutPdf[pdfIndex].url
    linkedResourceWithoutPdf.splice(pdfIndex, 1)
  }
  header['linked-resources'] = linkedResourceWithoutPdf

  return header
}
