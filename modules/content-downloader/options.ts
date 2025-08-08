// noinspection ES6PreferShortImport

import authentication from '../../app/site/authentication'
import siteMeta from '../../app/site/meta'
import { filename } from '../commit-sha-file-generator/common'
import * as files from '../../app/site/files'

/**
 * Options for the content downloader module.
 */
export interface ModuleOptions {
  /**
   * Represents GitHub-related configuration details required for API integration
   * or repository-related operations.
   */
  github: {
    /**
     * The GitHub personal access token retrieved from the environment variables.
     * This token is typically used to authenticate API requests made to GitHub services.
     */
    accessToken: string
    /**
     * The username of the GitHub account.
     */
    username: string
    /**
     * The main repository name of the project.
     */
    repository: string
    /**
     * The name of the repository that contains project data.
     */
    dataRepository: string
  }
  /**
   * An object representing destination paths for various downloads used in the project.
   */
  downloadDestinations: {
    /**
     * The file path where the previous build data is stored.
     */
    previousBuild: string
    /**
     * The file path where project-specific data files are stored.
     */
    data: string
  }
  /**
   * Represents an array of file system paths corresponding to directories
   * used in previous builds of a project. These paths can be utilized
   * for comparison tasks related to prior builds.
   */
  previousBuildDirectories: string[]
  /**
   * Represents the directory path where LaTeX files are stored or will be stored.
   */
  dataLatexDirectory: string
  /**
   * The latest commit SHA filename.
   */
  latestCommitShaFilename: string | null
}

/**
 * The default options.
 */
export default {
  github: {
    accessToken: authentication.accessToken,
    ...siteMeta.github
  },
  downloadDestinations: files.downloadDestinations,
  previousBuildDirectories: [files.latexPdfDestinationDirectory, files.latexAssetsDestinationDirectoryName],
  dataLatexDirectory: files.dataLatexDirectory,
  latestCommitShaFilename: filename
}
