// noinspection ES6PreferShortImport

import { filterFilename } from '../../app/site/files'
import path from 'path'
import * as files from '../../app/site/files'
import debug from '../../app/site/debug'

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
  const regex = /\\documentclass(\[[A-Za-zÀ-ÖØ-öø-ÿ\d, =.\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\d/, .-]+)}/gs
  const filteredFilename = filterFilename(filename)
  const printVariant: Variant = {
    filename: `${filteredFilename}-impression`,
    fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../impression}'),
    type: 'impression'
  }
  const result = [printVariant]
  if (filename.endsWith('-cours')) {
    const studentVariant: Variant = {
      filename: `${filteredFilename}-eleve`,
      fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../eleve}'),
      type: 'élève'
    }
    const studentPrintVariant: Variant = {
      filename: `${filteredFilename}-eleve-impression`,
      fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../impression}\n\\include{../eleve}'),
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
const ignores = [
  'devoir.tex',
  'eleve.tex',
  'geogebra.tex',
  'groupes.tex',
  'impression.tex',
  'pandoc.tex',
  'scratch.tex'
]

/**
 * Options for the PDF generator module.
 */
export interface ModuleOptions {
  /**
   * Specifies the directory path for data Latex files.
   */
  directory: string
  /**
   * The file path where the previous build data is stored.
   */
  previousBuildDirectory: string
  /**
   * The directory path where generated PDF files from LaTeX sources will be stored.
   */
  destinationDirectory: string
  /**
   * Generates an array of variant objects based on the given file path and file content.
   *
   * @param {string} filePath The path of the input file.
   * @param {string} fileContent The content of the input file.
   * @returns {null | Variant[]} An array of generated variants or `null` if the input file is named 'questions-flash'.
   */
  generateVariants: (filePath: string, fileContent: string) => null | Variant[]
  /**
   * A list of file names to be ignored during certain operations.
   */
  ignores: string[]
  /**
   * Retrieves a list of directories to include when resolving graphics files for a LaTeX document.
   *
   * @param latexFilePath The absolute path of the LaTeX file.
   */
  getIncludeGraphicsDirectories: (latexFilePath: string) => string[]
  /**
   * Whether files should be moved instead of copied.
   */
  moveFiles: boolean
  /**
   * Filters a given LaTeX filename by removing specific suffixes or altering the filename
   * if certain suffixes are present at the end.
   *
   * @param file The LaTeX filename to filter.
   * @returns The modified or original filename after processing.
   */
  renameFile(file: string): string
}

/**
 * The default options.
 */
export default {
  directory: files.downloadDestinations.data + '/' + files.dataLatexDirectory,
  previousBuildDirectory: files.downloadDestinations.previousBuild,
  destinationDirectory: files.latexPdfDestinationDirectory,
  generateVariants: generateVariants,
  ignores: ignores,
  getIncludeGraphicsDirectories: files.getIncludeGraphicsDirectories,
  moveFiles: !debug,
  renameFile: files.filterFilename
}
