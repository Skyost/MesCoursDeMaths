// noinspection ES6PreferShortImport

import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import { Octokit } from '@octokit/core'
import { createResolver, defineNuxtModule, type Resolver, useLogger } from '@nuxt/kit'
import debug from '../../app/site/debug'
import defaultOptions, { type ModuleOptions } from './options'

const name = 'content-downloader'

/**
 * The logger instance.
 */
const logger = useLogger(name)

/**
 * Nuxt module for downloading the website content.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version: '0.0.1',
    compatibility: { nuxt: '^4.0.0' },
    configKey: 'contentDownloader'
  },
  defaults: defaultOptions,
  setup: async (options, nuxt) => {
    const resolver = createResolver(import.meta.url)
    const rootDir = nuxt.options.rootDir

    let latestCommitShaFilePath = null
    if (!debug && options.latestCommitShaFilename && nuxt.options.commitShaFileGenerator) {
      latestCommitShaFilePath = resolver.resolve(rootDir, nuxt.options.commitShaFileGenerator.directory, options.latestCommitShaFilename)
    }

    const previousBuildDirectories = [
      ...options.previousBuildDirectories,
      nuxt.options.latexPdfGenerator.destinationDirectoryName,
      nuxt.options.latexToContent.assetsDestinationDirectoryName
    ]
    await downloadPreviousBuild(
      resolver,
      rootDir,
      previousBuildDirectories,
      options
    )
    await downloadRemoteDirectory(
      resolver,
      rootDir,
      latestCommitShaFilePath,
      options
    )
  }
})

/**
 * Downloads the previous build from Github pages.
 * @param resolver The resolver instance.
 * @param rootDir The source directory.
 * @param directoriesToExtract The directories to extract from the zipped previous build of the website.
 * @param options The module options.
 * @returns Whether the download is a success.
 */
async function downloadPreviousBuild(
  resolver: Resolver,
  rootDir: string,
  directoriesToExtract: string[],
  options: ModuleOptions
): Promise<boolean> {
  try {
    const directoryPath = resolver.resolve(rootDir, options.downloadDestinations.previousBuild)
    if (fs.existsSync(directoryPath)) {
      return true
    }

    logger.info(`Downloading and unzipping the previous build at ${options.github.username}/${options.github.repository}@gh-pages...`)
    // We create the Octokit instance.
    const octokit = new Octokit()
    const response = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
      owner: options.github.username,
      repo: options.github.repository,
      ref: 'gh-pages'
    })

    // We read the response using AdmZip.
    const zip = new AdmZip(Buffer.from(response.data as Buffer))
    const zipRootDir = zip.getEntries()[0]!.entryName

    // We extract it to the parent folder.
    const parentPath = path.dirname(directoryPath)
    if (!fs.existsSync(parentPath)) {
      fs.mkdirSync(parentPath, { recursive: true })
    }
    for (const previousBuildDirectory of directoriesToExtract) {
      zip.extractEntryTo(`${zipRootDir}${previousBuildDirectory}/`, parentPath)
    }

    // Then we can rename the main entry into the destination folder name.
    fs.renameSync(resolver.resolve(parentPath, zipRootDir), resolver.resolve(parentPath, path.basename(directoryPath)))
    logger.success('Done.')
    return true
  }
  catch (exception) {
    logger.warn(exception)
  }
  return false
}

/**
 * Downloads the remote directory content.
 *
 * @param resolver The resolver instance.
 * @param rootDir The root directory.
 * @param latestCommitShaFilePath The latest commit sha file path.
 * @param options Module options.
 * @returns Whether the download is a success.
 */
async function downloadRemoteDirectory(
  resolver: Resolver,
  rootDir: string,
  latestCommitShaFilePath: string | null,
  options: ModuleOptions
): Promise<boolean> {
  if (options.github.repository === options.github.dataRepository) {
    fs.cpSync(resolver.resolve(rootDir, options.dataLatexDirectory), resolver.resolve(rootDir, options.downloadDestinations.data))
    return true
  }
  const octokit = new Octokit({ auth: options.github.accessToken })
  if (latestCommitShaFilePath) {
    logger.info(`Getting and saving the latest commit info of ${options.github.username}/${options.github.dataRepository}...`)
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
      owner: options.github.username,
      repo: options.github.dataRepository,
      ref: 'main'
    })
    let latestCommitData = {
      dataRepository: {
        long: response.data.sha,
        short: response.data.sha.substring(0, 7)
      }
    }
    if (fs.existsSync(latestCommitShaFilePath)) {
      latestCommitData = {
        ...latestCommitData,
        ...JSON.parse(fs.readFileSync(latestCommitShaFilePath, { encoding: 'utf8' }))
      }
    }
    else {
      const fileDirectory = path.dirname(latestCommitShaFilePath)
      if (!fs.existsSync(fileDirectory)) {
        fs.mkdirSync(fileDirectory, { recursive: true })
      }
    }
    fs.writeFileSync(latestCommitShaFilePath, JSON.stringify(latestCommitData))
    logger.success(`Done, wrote in ${latestCommitShaFilePath}.`)
  }

  const directoryPath = resolver.resolve(rootDir, options.downloadDestinations.data)
  if (!fs.existsSync(directoryPath)) {
    logger.info(`Downloading and unzipping ${options.github.username}/${options.github.dataRepository}...`)
    const response = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
      owner: options.github.username,
      repo: options.github.dataRepository,
      ref: 'main'
    })

    const zip = new AdmZip(Buffer.from(response.data as Buffer))
    const zipRootDir = zip.getEntries()[0]!.entryName

    const parentPath = path.dirname(directoryPath)
    if (!fs.existsSync(parentPath)) {
      fs.mkdirSync(parentPath, { recursive: true })
    }
    zip.extractEntryTo(`${zipRootDir}${options.dataLatexDirectory}/`, parentPath)

    fs.renameSync(resolver.resolve(parentPath, zipRootDir), resolver.resolve(parentPath, path.basename(directoryPath)))
    logger.success('Done.')
  }
  return true
}
