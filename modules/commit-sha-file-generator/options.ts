import { name } from './index'

/**
 * The target URL of the commit SHA file.
 */
const targetUrl = '/_api/'

/**
 * The generation directory.
 */
const directory = `node_modules/.${name}/`

/**
 * Holds the default options for this module.
 */
const defaultOptions = { targetUrl, directory }

/**
 * The default options.
 */
export default defaultOptions

/**
 * Options for this module.
 */
export type ModuleOptions = typeof defaultOptions
