import path from 'path'

/**
 * An object representing destination paths for various downloads used in the project.
 */
export const downloadDestinations = {
  /**
   * The file path where the previous build data is stored.
   */
  previousBuild: 'node_modules/.previous-build',
  /**
   * The file path where project-specific data files are stored.
   */
  data: 'node_modules/.data'
}

/**
 * Represents the directory path where LaTeX files are stored or will be stored.
 */
export const dataLatexDirectory: string = 'latex'

/**
 * The directory path where generated PDF files from LaTeX sources will be stored.
 */
export const latexPdfDestinationDirectory: string = 'pdf'

/**
 * Represents the name of the destination directory where LaTeX-related assets, such as images, are stored.
 */
export const latexAssetsDestinationDirectoryName: string = 'images'

/**
 * Filters a given LaTeX filename by removing specific suffixes or altering the filename
 * if certain suffixes are present at the end.
 *
 * @param latexFilename The LaTeX filename to filter.
 * @returns The modified or original filename after processing.
 */
export const filterFilename = (latexFilename: string) => {
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
 * Retrieves a list of directories to include when resolving graphics files for a LaTeX document.
 *
 * @param latexFilePath The absolute path of the LaTeX file.
 */
export const getIncludeGraphicsDirectories = (latexFilePath: string): string[] => [
  path.resolve(path.dirname(latexFilePath), path.parse(latexFilePath).name),
  path.dirname(latexFilePath)
]
