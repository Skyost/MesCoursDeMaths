// noinspection ES6PreferShortImport

import siteMeta from '../../app/site/meta'
import { filename as latestCommitShaFilename } from '../commit-sha-file-generator/common'

/**
 * An object representing destination paths for various downloads used in the project.
 */
const downloadDestinations = {
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
const dataLatexDirectory: string = 'latex'

/**
 * Holds the default options for this module.
 */
const defaultOptions = {
  github: {
    accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    ...siteMeta.github
  },
  downloadDestinations,
  dataLatexDirectory,
  previousBuildDirectories: [],
  latestCommitShaFilename
}

/**
 * The default options.
 */
export default defaultOptions

/**
 * Options for this module.
 */
export type ModuleOptions = typeof defaultOptions
