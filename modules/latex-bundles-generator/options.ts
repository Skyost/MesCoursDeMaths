import * as fs from 'fs'
import * as path from 'path'

/**
 * Represents a bundle of LaTeX files that are used to generate a single PDF document.
 */
export interface LatexBundle {
  /**
   * The title of the bundle.
   */
  title: string
  /**
   * An array of parts that make up the bundle.
   * Each part represents a separate LaTeX file that is included in the bundle.
   */
  parts: LatexBundlePart[]
  /**
   * The file path where the bundle is stored.
   */
  destinationFilePath: string
}

/**
 * Represents a part of a bundle of LaTeX files.
 * Each part represents a separate LaTeX file that is included in the bundle.
 */
export interface LatexBundlePart {
  /**
   * The title of the part.
   */
  title: string | undefined
  /**
   * The file path of the LaTeX file that contains the part's content.
   */
  latexFilePath: string
  /**
   * The indices of the part's preamble in the LaTeX file.
   */
  preamble: {
    /**
     * The begin index.
     */
    beginIndex: number
    /**
     * The end index.
     */
    endIndex: number
    /**
     * Whether the preamble should be skipped.
     */
    skip: boolean
  }
  /**
   * The indices of the part's content in the LaTeX file.
   */
  content: {
    /**
     * The begin index.
     */
    beginIndex: number
    /**
     * The end index.
     */
    endIndex: number
    /**
     * Whether the content should be skipped.
     */
    skip: boolean
  }
  /**
   * The string to be inserted before the part's content.
   */
  before: string
  /**
   * The string to be inserted after the part's content.
   */
  after: string
}

/**
 * Represents the LaTeX template for generating a bundle of LaTeX files.
 * This template is used to assemble the parts of a bundle into a single PDF document.
 */
const bundleLatexTemplate: string = `\\documentclass{../common/class}

\\usepackage{../common/bundle}

{preamble}

\\begin{document}

\\doc{{title}}

\\AtEndEnvironment{document}{\\newpage}

{content}

\\end{document}
`

/**
 * Retrieves the list of bundles for a given grade directory.
 * @param gradeDirectoryPath The path to the directory containing the grade files.
 * @returns An array of bundles, each representing a set of LaTeX files that are assembled into a single PDF document.
 */
const getGradeBundles = (gradeDirectoryPath: string): LatexBundle[] => {
  interface LatexBundlePartData {
    parts: LatexBundlePart[]
    titleParts: string[]
    filename: string
  }

  const bundles: LatexBundle[] = []
  const files = fs.readdirSync(gradeDirectoryPath)
  const relevantSuffix = '-cours.tex'
  for (const file of files) {
    if (file.endsWith(relevantSuffix)) {
      const prefix = file.substring(0, file.length - relevantSuffix.length)
      const data: LatexBundlePartData[] = []
      for (const file of files) {
        const bundleFilename = getBundlePartFilename(relevantSuffix, prefix, file)
        if (bundleFilename) {
          const part = getBundlePart(path.resolve(gradeDirectoryPath, file))
          if (part) {
            const fileData = data.find(value => value.filename === bundleFilename)
            if (fileData) {
              fileData.parts = [...fileData.parts, part]
              if (part.title && !fileData.titleParts.includes(part.title)) {
                fileData.titleParts.push(part.title)
              }
            }
            else {
              data.push({
                parts: [part],
                titleParts: part.title ? [part.title] : [],
                filename: bundleFilename
              })
            }
          }
        }
      }
      for (const { parts, titleParts, filename } of data) {
        bundles.push({
          title: titleParts.length > 0 ? titleParts.join(' / ') : prefix,
          parts,
          destinationFilePath: path.resolve(gradeDirectoryPath, filename)
        })
      }
    }
  }
  return bundles
}

/**
 * Retrieves the filename of the bundle part based on the provided parameters.
 * @param relevantSuffix The suffix to be checked against the filename.
 * @param prefix The prefix to be checked against the filename.
 * @param filename The filename to be checked.
 * @returns The filename of the bundle part if it matches the provided criteria, otherwise null.
 */
const getBundlePartFilename = (relevantSuffix: string, prefix: string, filename: string): string | null => {
  if (!filename.startsWith(prefix) || filename.endsWith(relevantSuffix)) {
    return null
  }
  if ((RegExp(prefix + /-activite-([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)/.source)).test(filename)) {
    return `${prefix}-activites.tex`
  }
  return null
}

/**
 * Represents a part of a bundle of LaTeX files with a title.
 */
interface LatexBundlePartWithTitle extends LatexBundlePart {
  /**
   * The title of the part.
   */
  title: string | undefined
}

/**
 * Retrieves the part of a LaTeX file that is used to generate a bundle.
 * @param latexFilePath The path to the LaTeX file to be processed.
 * @returns The part of the LaTeX file that is used to generate a bundle, or null if the file is not a bundle part.
 */
const getBundlePart = (latexFilePath: string): LatexBundlePartWithTitle | null => {
  const content = fs.readFileSync(latexFilePath, { encoding: 'utf-8' })

  let docBeginIndex = content.indexOf('\\begin{document}')
  if (docBeginIndex === -1) {
    return null
  }

  const preamble = content.substring(0, docBeginIndex)
  // if (
  //   preamble.includes('\\usepackage{../common/scratchalgo}')
  //   || preamble.includes('\\usepackage{../common/geogebra}')
  //   || preamble.includes('\\usepackage{../common/spreadsheet}')
  // ) {
  //   return null
  // }

  let preambleBeginIndex = 0
  const preambleEndIndex = docBeginIndex
  const documentClassRegex = /\\documentclass(?:\s*\[([^\]]*)])?\s*\{([^}]*)}/gs
  let matchResult = documentClassRegex.exec(preamble)
  if (matchResult && matchResult.length > 0) {
    preambleBeginIndex = matchResult.index + matchResult[0].length
  }

  const docEndIndex = content.indexOf('\\end{document}')
  const docMacroRegex = /\\doc(?:\s*\[([^\]]*)])?\s*\{([^}]*)}\s*(?:\[(.*?)])?/gs
  matchResult = docMacroRegex.exec(content)
  let title
  if (matchResult && matchResult.length > 0) {
    docBeginIndex = matchResult.index + matchResult[0].length
    title = matchResult[2]
  }
  else {
    docBeginIndex += '\\begin{document}'.length
  }
  const nameWithoutExtension = path.parse(latexFilePath).name
  return {
    title,
    latexFilePath,
    preamble: {
      beginIndex: preambleBeginIndex,
      endIndex: preambleEndIndex,
      skip: preamble.includes('%-- bundle-preamble-skip --%')
    },
    content: {
      beginIndex: docBeginIndex,
      endIndex: docEndIndex,
      skip: preamble.includes('%-- bundle-content-skip --%')
    },
    before: `\n\\bundlePart{${nameWithoutExtension}}\n\n`,
    after: '\n\\bundlePartEnd\n'
  }
}

/**
 * Holds the default options for this module.
 */
const defaultOptions = {
  bundleLatexTemplate,
  getGradeBundles
}

/**
 * The default options.
 */
export default defaultOptions

/**
 * Options for this module.
 */
export type ModuleOptions = typeof defaultOptions
