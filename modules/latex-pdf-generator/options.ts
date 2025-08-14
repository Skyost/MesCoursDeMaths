// noinspection ES6PreferShortImport

import path from 'path'
import debug from '../../app/site/debug'

/**
 * The directory path where generated PDF files from LaTeX sources will be stored.
 */
export const destinationDirectoryName: string = 'pdf'

/**
 * Represents a LaTeX file variant.
 */
export interface Variant {
  /**
   * The variant file name.
   */
  filename: string
  /**
   * The variant file content.
   */
  fileContent: string
  /**
   * The variant type.
   */
  type: string
}

/**
 * Generates an array of variant objects based on the given file path and file content.
 *
 * @param {string} filePath The path of the input file.
 * @param {string} fileContent The content of the input file.
 * @returns {null | Variant[]} An array of generated variants or `null` if the input file is named 'questions-flash'.
 */
const generateVariants = (filePath: string, fileContent: string): null | Variant[] => {
  const filename = path.parse(filePath).name
  if (filename === 'questions-flash') {
    return null
  }

  const beginDocument = '\\begin{document}'
  if (!fileContent.includes(beginDocument)) {
    return null
  }

  const filteredFilename = filterFilename(filename)
  const printVariant: Variant = {
    filename: `${filteredFilename}-impression`,
    fileContent: fileContent.replace(beginDocument, `\\include{../common/includes/print}\n${beginDocument}`),
    type: 'impression'
  }
  const result = [printVariant]
  if (filename.endsWith('-cours')) {
    const studentVariant: Variant = {
      filename: `${filteredFilename}-eleve`,
      fileContent: fileContent.replace(beginDocument, `\\include{../common/includes/student}\n${beginDocument}`),
      type: 'élève'
    }
    const studentPrintVariant: Variant = {
      filename: `${filteredFilename}-eleve-impression`,
      fileContent: fileContent.replace(beginDocument, `\\include{../common/includes/print}\n\\include{../common/includes/student}\n${beginDocument}`),
      type: 'élève / impression'
    }
    result.push(studentVariant, studentPrintVariant)
  }
  return result
}

/**
 * A list of file names to be ignored during certain operations.
 * These file names typically represent files that should not be processed
 * or included in specific workflows or tasks.
 */
const ignores: string[] = [
  'common/includes/student.tex',
  'common/includes/print.tex',
  'common/includes/pandoc.tex'
]

/**
 * Retrieves a list of directories to include when resolving graphics files for a LaTeX document.
 *
 * @param latexFilePath The absolute path of the LaTeX file.
 */
export const getIncludeGraphicsDirectories = (latexFilePath: string): string[] => [
  path.resolve(path.dirname(latexFilePath), path.parse(latexFilePath).name),
  path.dirname(latexFilePath)
]

/**
 * Filters a given LaTeX filename by removing specific suffixes or altering the filename
 * if certain suffixes are present at the end.
 *
 * @param latexFilename The LaTeX filename to filter.
 * @returns The modified or original filename after processing.
 */
const filterFilename = (latexFilename: string) => {
  let suffixToRemove = '-cours'
  if (latexFilename.endsWith(suffixToRemove)) {
    return latexFilename.substring(0, latexFilename.length - suffixToRemove.length)
  }
  suffixToRemove = '-cours-impression'
  if (latexFilename.endsWith(suffixToRemove)) {
    return latexFilename.substring(0, latexFilename.length - suffixToRemove.length) + '-impression'
  }
  return latexFilename
}

/**
 * Holds the default options for this module.
 */
const defaultOptions = {
  destinationDirectoryName,
  generateVariants,
  ignores,
  getIncludeGraphicsDirectories,
  moveFiles: !debug,
  filterFilename
}

/**
 * The default options.
 */
export default defaultOptions

/**
 * Options for this module.
 */
export type ModuleOptions = typeof defaultOptions
