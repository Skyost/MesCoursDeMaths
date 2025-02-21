// noinspection ES6PreferShortImport

import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import { Octokit } from '@octokit/core'
import { createResolver, defineNuxtModule, type Resolver, useLogger } from '@nuxt/kit'
import { authentication } from '../site/authentication'
import { siteContentSettings } from '../site/content'
import { siteMeta } from '../site/meta'
import { debug } from '../site/debug'
import { file } from './commit-sha-file-generator/common'

/**
 * Options for the content downloader module.
 */
export interface ModuleOptions {
  github: {
    accessToken: string
    username: string
    repository: string
    dataRepository: string
  }
  downloadDestinations: {
    previousBuild: string
    data: string
  }
  previousBuildDirectories: string[]
  dataLatexDirectory: string
  latestCommitShaFilename: string | null
}

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
    compatibility: { nuxt: '^3.0.0' },
    configKey: 'contentDownloader'
  },
  defaults: {
    github: {
      accessToken: authentication.accessToken,
      ...siteMeta.github
    },
    downloadDestinations: siteContentSettings.downloadDestinations,
    previousBuildDirectories: [siteContentSettings.latexPdfDestinationDirectory, siteContentSettings.latexAssetsDestinationDirectoryName],
    dataLatexDirectory: siteContentSettings.dataLatexDirectory,
    latestCommitShaFilename: file
  },
  setup: async (options, nuxt) => {
    const resolver = createResolver(import.meta.url)
    const srcDir = nuxt.options.srcDir

    let latestCommitShaFilePath = null
    if (!debug && options.latestCommitShaFilename) {
      latestCommitShaFilePath = resolver.resolve(srcDir, options.latestCommitShaFilename)
    }

    await downloadPreviousBuild(resolver, srcDir, options)
    await downloadRemoteDirectory(resolver, srcDir, latestCommitShaFilePath, options)
  }
})

/**
 * Downloads the previous build from Github pages.
 * @param resolver The resolver instance.
 * @param srcDir The source directory.
 * @param options The module options.
 * @returns Whether the download is a success.
 */
async function downloadPreviousBuild(resolver: Resolver, srcDir: string, options: ModuleOptions): Promise<boolean> {
  try {
    const directoryPath = resolver.resolve(srcDir, options.downloadDestinations.previousBuild)
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
    const zipRootDir = zip.getEntries()[0].entryName

    // We extract it to the parent folder.
    const parentPath = path.dirname(directoryPath)
    if (!fs.existsSync(parentPath)) {
      fs.mkdirSync(parentPath, { recursive: true })
    }
    for (const previousBuildDirectory of options.previousBuildDirectories) {
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
 * @param srcDir The source directory.
 * @param latestCommitShaFilePath The latest commit sha file path.
 * @param options Module options.
 * @returns Whether the download is a success.
 */
async function downloadRemoteDirectory(
  resolver: Resolver,
  srcDir: string,
  latestCommitShaFilePath: string | null,
  options: ModuleOptions
): Promise<boolean> {
  if (options.github.repository === options.github.dataRepository) {
    fs.cpSync(resolver.resolve(srcDir, options.dataLatexDirectory), resolver.resolve(srcDir, options.downloadDestinations.data))
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

  const directoryPath = resolver.resolve(srcDir, options.downloadDestinations.data)
  if (!fs.existsSync(directoryPath)) {
    logger.info(`Downloading and unzipping ${options.github.username}/${options.github.dataRepository}...`)
    const response = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
      owner: options.github.username,
      repo: options.github.dataRepository,
      ref: 'main'
    })

    const zip = new AdmZip(Buffer.from(response.data as Buffer))
    const zipRootDir = zip.getEntries()[0].entryName

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
