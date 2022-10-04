import fs from 'fs'
import {execSync} from 'child_process'
import * as path from 'path'
import {parse} from 'node-html-parser'
import AdmZip from 'adm-zip'
import {Octokit} from '@octokit/core'
import fsExtra from 'fs-extra'
import katex from 'katex'
import matter from 'gray-matter'
import {createResolver, defineNuxtModule} from '@nuxt/kit'
import authentication from '../site/authentication'
import siteMeta from '../site/meta'
import debug from '../site/debug'
import directories from '../site/directories'
import contentGenerator from '../site/content-generator'
import logger from '../utils/logger'
import utils from '../utils/utils'

const name = 'generate-content'
export default defineNuxtModule({
  meta: {
    name,
    version: '0.0.1',
    compatibility: { nuxt: '^3.0.0-rc.9' },
    configKey: 'contentGenerator'
  },
  defaults: {
    github: {
      accessToken: authentication.accessToken,
      ...siteMeta.github
    },
    directories,
    contentGenerator
  },
  setup: async (options, nuxt) => {
    const contentGenerator = options.contentGenerator
    const directories = options.directories
    const github = options.github

    const resolver = createResolver(import.meta.url)
    const srcDir = nuxt.options.srcDir

    const tempDirs = []
    const downloadPreviousBuildResult = await downloadPreviousBuild(resolver, srcDir, github, contentGenerator)
    let previousBuildDir
    let previousImagesBuildDir
    if (downloadPreviousBuildResult) {
      previousBuildDir = downloadPreviousBuildResult.previousBuildDir
      tempDirs.push(previousBuildDir)

      previousImagesBuildDir = downloadPreviousBuildResult.previousImagesBuildDir
      tempDirs.push(previousImagesBuildDir)
    }

    const downloadDirectory = directories.downloadDirectory || nuxt.options.srcDir

    const lessonsDirectory = resolver.resolve(downloadDirectory, directories.lessonsDirectory)
    const pandocRedefinitions = resolver.resolve(lessonsDirectory, 'pandoc.tex')
    const extractedImagesDir = resolver.resolve(lessonsDirectory, '.extracted-images')

    const imagesDestDir = resolver.resolve(nuxt.options.vite.publicDir.toString(), contentGenerator.imagesDestination)

    const imagesDirectories = Object.fromEntries(Object.entries(contentGenerator.imagesDirectories)
      .map(([imagesDir, destDir]) => [resolver.resolve(downloadDirectory, imagesDir), resolver.resolve(imagesDestDir, destDir)]))

    const ignored = contentGenerator.ignored
      .map(file => resolver.resolve(downloadDirectory, file))
      .concat(Object.keys(imagesDirectories))

    ignored.push(extractedImagesDir)
    ignored.push(pandocRedefinitions)

    const tempDir = await downloadRemoteDirectory(resolver, github, directories, lessonsDirectory)
    if (tempDir) {
      tempDirs.push(tempDir)
    }

    for (const [directory, destination] of Object.entries(imagesDirectories)) {
      await handleImages(resolver, directory, previousImagesBuildDir, destination)
    }

    await processFiles(
      resolver,
      contentGenerator,
      lessonsDirectory,
      previousBuildDir,
      resolver.resolve(srcDir, 'content'),
      resolver.resolve(nuxt.options.vite.publicDir.toString(), contentGenerator.pdfDestination),
      contentGenerator.pdfDestination,
      extractedImagesDir,
      imagesDestDir,
      contentGenerator.imagesDestination,
      pandocRedefinitions,
      ignored
    )
    await handleImages(resolver, extractedImagesDir, previousImagesBuildDir, imagesDestDir)
    cleanTempDirs(tempDirs)
  }
})

async function downloadPreviousBuild (resolver, srcDir, github, contentGenerator) {
  try {
    logger.info(name, `Downloading and unzipping the previous build at ${github.username}/${github.repository}@gh-pages...`)
    const octokit = new Octokit({ auth: github.accessToken })
    const response = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
      owner: github.username,
      repo: github.repository,
      ref: 'gh-pages'
    })
    const zip = new AdmZip(Buffer.from(response.data))
    const zipRootDir = zip.getEntries()[0].entryName
    const tempDirectory = resolver.resolve(srcDir, 'temp')
    if (!fs.existsSync(tempDirectory)) {
      fs.mkdirSync(tempDirectory, { recursive: true })
    }
    zip.extractEntryTo(`${zipRootDir}${contentGenerator.pdfDestination}/`, tempDirectory)
    zip.extractEntryTo(`${zipRootDir}${contentGenerator.imagesDestination}/`, tempDirectory)
    return {
      tempDirectory,
      previousBuildDir: resolver.resolve(tempDirectory, zipRootDir, contentGenerator.pdfDestination),
      previousImagesBuildDir: resolver.resolve(tempDirectory, zipRootDir, contentGenerator.imagesDestination)
    }
  } catch (exception) {
    logger.warn(name, exception)
  }
  return null
}

async function downloadRemoteDirectory (resolver, github, directories, lessonsDirectory) {
  if (github.repository === github.dataRepository || fs.existsSync(lessonsDirectory)) {
    return null
  }
  logger.info(name, `Downloading and unzipping ${github.username}/${github.dataRepository}...`)
  const octokit = new Octokit({ auth: github.accessToken })
  const response = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
    owner: github.username,
    repo: github.dataRepository,
    ref: 'main'
  })
  const zip = new AdmZip(Buffer.from(response.data))
  const tempDirectory = resolver.resolve(directories.downloadDirectory, 'temp')
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true })
  }
  zip.extractAllTo(tempDirectory, true)
  const repoDirectory = utils.getDirectories(tempDirectory)[0]
  fsExtra.copySync(resolver.resolve(tempDirectory, repoDirectory, directories.lessonsDirectory), lessonsDirectory, {})
  return tempDirectory
}

function cleanTempDirs (tempDirs) {
  logger.info(name, 'Cleaning temporary directories...')
  for (const tempDir of tempDirs) {
    fsExtra.removeSync(tempDir)
  }
}

async function processFiles (
  resolver,
  contentGenerator,
  directory,
  previousBuildDir,
  mdDir,
  pdfDir,
  pdfDestUrl,
  extractedImagesDir,
  imagesDestDir,
  imagesDestUrl,
  pandocRedefinitions,
  ignored
) {
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const filePath = resolver.resolve(directory, file)
    if (!fs.existsSync(filePath) || ignored.includes(filePath)) {
      continue
    }
    if (fs.lstatSync(filePath).isDirectory()) {
      await processFiles(
        resolver,
        contentGenerator,
        filePath,
        resolver.resolve(previousBuildDir, file),
        resolver.resolve(mdDir, file),
        resolver.resolve(pdfDir, file),
        `${pdfDestUrl}/${file}`,
        resolver.resolve(extractedImagesDir, file),
        resolver.resolve(imagesDestDir, file),
        `${imagesDestUrl}/${file}`,
        pandocRedefinitions,
        ignored
      )
    } else if (file.endsWith('.tex')) {
      logger.info(name, `Processing "${filePath}"...`)
      const fileName = utils.getFileName(file)
      const filteredFileName = contentGenerator.fileNameFilter(fileName)
      fs.mkdirSync(mdDir, { recursive: true })
      const mdFile = resolver.resolve(mdDir, `${filteredFileName}.md`)
      const imagesDir = resolver.resolve(imagesDestDir, fileName)
      if (contentGenerator.shouldGenerateMarkdown(fileName) && (!debug.debug || !fs.existsSync(mdFile))) {
        extractImages(resolver, contentGenerator, filePath, extractedImagesDir)
        const htmlContent = execSync(`pandoc "${path.relative(directory, pandocRedefinitions)}" "${filePath}" -t html --gladtex --number-sections --shift-heading-level-by=1 --html-q-tags`, {
          cwd: directory,
          encoding: 'utf-8'
        })
        const root = parse(htmlContent)
        const linkedResources = contentGenerator.getMarkdownLinkedResources(directory, file, pdfDestUrl)
        replaceImages(resolver, root, imagesDir, imagesDestUrl + '/' + fileName)
        replaceVspaceElements(root)
        adjustColSize(root)
        numberizeTitles(root)
        renderMath(root)
        fs.writeFileSync(mdFile, toString(filteredFileName, root, linkedResources))
      }
      if (contentGenerator.shouldGeneratePDF(fileName)) {
        const content = fs.readFileSync(filePath, { encoding: 'utf-8' }).toString()
        const printVariant = contentGenerator.generatePrintVariant(fileName, content)
        if (printVariant) {
          fs.writeFileSync(filePath, printVariant)
          generatePdf(resolver, directory, previousBuildDir, file, imagesDir, pdfDir, `${filteredFileName}-impression.pdf`)
          fs.writeFileSync(filePath, content)
        }
        generatePdf(resolver, directory, previousBuildDir, file, imagesDir, pdfDir, `${filteredFileName}.pdf`)
      }
    }
  }
}

function extractImages (resolver, contentGenerator, filePath, extractedImagesDir) {
  const imagesDir = resolver.resolve(extractedImagesDir, utils.getFileName(filePath))
  for (const blockType of contentGenerator.imagesToExtract) {
    // const regex = /\\begin{tikzpicture}([\s\S]*?)\\end{tikzpicture}/sg
    const regex = new RegExp(`\\\\begin{${blockType}}([\\s\\S]*?)\\\\end{${blockType}}`, 'sg')
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' }).toString()
    let match = regex.exec(content)
    if (match != null) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }
    let i = 1
    while (match != null) {
      const fileName = `${blockType}-${i}.tex`
      fs.writeFileSync(resolver.resolve(imagesDir, fileName), contentGenerator.generateExtractedImageFileContent(imagesDir, filePath, blockType, match[0]))
      i++
      match = regex.exec(content)
    }
  }
}

function replaceImages (resolver, root, imagesDestDir, imagesDestURL) {
  const images = root.querySelectorAll('img')
  for (const image of images) {
    const src = image.getAttribute('src')
    const extension = path.extname(src)
    if (extension === '') {
      image.setAttribute('alt', src)
      for (const testExtension of ['.svg', '.png', '.jpeg', '.jpg']) {
        if (fs.existsSync(resolver.resolve(imagesDestDir, src + testExtension))) {
          image.setAttribute('src', `/${imagesDestURL}/${src}${testExtension}`)
          break
        }
      }
    }
  }
  const tikzImages = root.querySelectorAll('.tikz-image')
  for (let i = 0; i < tikzImages.length; i++) {
    tikzImages[i].replaceWith(`<img src="/${imagesDestURL}/tikzpicture-${i + 1}.svg" class="extracted-image tikz-image" alt="Tikz ${i + 1}">`)
  }
  const scratchImages = root.querySelectorAll('.scratch-image')
  for (let i = 0; i < scratchImages.length; i++) {
    scratchImages[i].replaceWith(`<img src="/${imagesDestURL}/scratch-${i + 1}.svg" class="extracted-image scratch-image" alt="Scratch ${i + 1}">`)
  }
}

function replaceVspaceElements (root) {
  const vspaces = root.querySelectorAll('.vertical-space')
  for (const vspace of vspaces) {
    const text = vspace.text.trim()
    if (text.startsWith('-')) {
      vspace.remove()
      continue
    }
    vspace.setAttribute('style', `height: ${text};`)
    vspace.innerHTML = ''
  }
}

function adjustColSize (root) {
  const rows = root.querySelectorAll('.row')
  for (const row of rows) {
    const columns = row.querySelectorAll('.col')
    const sizeElement = row.querySelector('.first-col-size')
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
    sizeElement.remove()
  }
}

function numberizeTitles (root) {
  const numbers = root.querySelectorAll('.header-section-number')
  for (const number of numbers) {
    const numberText = number.text.trim()
    const parts = numberText.split('.')
    if (parts.length === 2) {
      number.innerHTML = `${utils.romanize(parts[1])} -`
    } else if (parts.length === 3) {
      number.innerHTML = `${parts[2]}.`
    } else if (parts.length === 4) {
      const bubbleTitle = root.querySelector(`h4[data-number='${numberText}']`)
      if (bubbleTitle && bubbleTitle.text.trim() === numberText) {
        bubbleTitle.remove()
      } else {
        number.remove()
      }
    }
  }
}

function renderMath (root) {
  const mathElements = root.querySelectorAll('eq')
  for (const mathElement of mathElements) {
    const text = mathElement.text.trim()
    mathElement.replaceWith(
      katex.renderToString(text, {
        displayMode: mathElement.getAttribute('env') === 'displaymath',
        output: 'html',
        trust: true,
        strict: errorCode => errorCode === 'htmlExtension' ? 'ignore' : 'warn',
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

async function handleImages (resolver, imagesDir, previousImagesBuildDir, imagesDestDir) {
  if (!fs.existsSync(imagesDir)) {
    return
  }
  const files = fs.readdirSync(imagesDir)
  for (const file of files) {
    const filePath = resolver.resolve(imagesDir, file)
    if (fs.lstatSync(filePath).isDirectory()) {
      await handleImages(resolver, filePath, previousImagesBuildDir, resolver.resolve(imagesDestDir, file))
    } else if (file.endsWith('.tex')) {
      logger.info(name, `Handling image "${filePath}"...`)
      const fileName = utils.getFileName(file)
      if (debug.debug && fs.existsSync(resolver.resolve(imagesDestDir, `${fileName}.svg`))) {
        continue
      }
      const pdfFileName = generatePdf(resolver, imagesDir, previousImagesBuildDir, file, imagesDir, imagesDir, `${fileName}.pdf`)
      if (pdfFileName) {
        const svgFile = pdftocairo(resolver, imagesDir, file)
        fs.mkdirSync(imagesDestDir, { recursive: true })
        fs.copyFileSync(resolver.resolve(imagesDir, svgFile), resolver.resolve(imagesDestDir, svgFile))
        fs.copyFileSync(resolver.resolve(imagesDir, `${pdfFileName}.checksums`), resolver.resolve(imagesDestDir, `${pdfFileName}.checksums`))
      }
    } else if (file.endsWith('.pdf')) {
      const svgFile = pdftocairo(resolver, imagesDir, file)
      fs.mkdirSync(imagesDestDir, { recursive: true })
      fs.copyFileSync(resolver.resolve(imagesDir, svgFile), resolver.resolve(imagesDestDir, svgFile))
    } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      fs.mkdirSync(imagesDestDir, { recursive: true })
      fs.copyFileSync(resolver.resolve(imagesDir, file), resolver.resolve(imagesDestDir, file))
    }
  }
}

function toString (slug, root, linkedResources) {
  const header = {}
  const title = root.querySelector('.doctitle p')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  header.slug = slug
  if (title) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    header.name = title.innerHTML.trim()
    header['page-title'] = title.text.trim()
    header['page-title-search'] = utils.normalizeString(header['page-title'])
  }
  const summary = root.querySelector('.docsummary p')
  if (summary) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    header.summary = summary.innerHTML.trim()
    header['page-description'] = summary.text.trim()
  }
  const number = root.querySelector('.docnumber p')
  if (number) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    header.number = parseInt(number.innerHTML.trim())
  }
  header['linked-resources'] = linkedResources
  return matter.stringify(root.innerHTML, header)
}

function generatePdf (resolver, directory, previousBuildDir, file, imagesDir, pdfDir, pdfFilename) {
  const filePath = resolver.resolve(directory, file)
  const destPdf = resolver.resolve(pdfDir, pdfFilename)
  if (debug.debug && fs.existsSync(destPdf)) {
    return null
  }
  const checksums = JSON.stringify(calculateTexFileChecksums(resolver, filePath, imagesDir))
  const previousChecksumsFile = resolver.resolve(previousBuildDir, `${pdfFilename}.checksums`)
  fs.mkdirSync(pdfDir, { recursive: true })
  fs.writeFileSync(resolver.resolve(pdfDir, `${pdfFilename}.checksums`), checksums)
  if (fs.existsSync(previousChecksumsFile) && checksums === fs.readFileSync(previousChecksumsFile, { encoding: 'utf-8' })) {
    fs.copyFileSync(resolver.resolve(previousBuildDir, `${pdfFilename}.pdf`), destPdf)
  } else if (latexmk(resolver, directory, file)) {
    pdfFilename = `${utils.getFileName(file)}.pdf`
    fs.copyFileSync(resolver.resolve(directory, pdfFilename), destPdf)
    execSync('latexmk -quiet -c', { cwd: directory })
  }
  return pdfFilename
}

function calculateTexFileChecksums (resolver, file, imagesDir) {
  const latexIncludeCommands = [
    {
      command: 'includegraphics',
      directory: imagesDir,
      extensions: ['.png', '.jpeg', '.jpg', '.svg']
    },
    {
      command: 'documentclass',
      directory: path.dirname(file),
      extensions: ['.cls']
    },
    {
      command: 'include',
      directory: path.dirname(file),
      extensions: ['.tex']
    }
  ]
  const fileName = utils.getFileName(file)
  const checksums = {}
  checksums[fileName] = utils.generateChecksum(fs.readFileSync(file, { encoding: 'utf-8' }))
  for (const latexIncludeCommand of latexIncludeCommands) {
    const regex = new RegExp(`\\\\${latexIncludeCommand.command}(\\[[A-Za-zÀ-ÖØ-öø-ÿ\\d, =.\\\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\\d/, .-]+)}`, 'gs')
    const content = fs.readFileSync(file, { encoding: 'utf-8' }).toString()
    let match = regex.exec(content)
    while (match != null) {
      const fileName = match[2]
      if (!Object.prototype.hasOwnProperty.call(checksums, fileName)) {
        const extensions = ['', ...latexIncludeCommand.extensions]
        let includeFile = resolver.resolve(latexIncludeCommand.directory, fileName)
        for (const extension of extensions) {
          const includeFileWithExtension = `${includeFile}${extension}`
          if (fs.existsSync(includeFileWithExtension)) {
            includeFile = includeFileWithExtension
            break
          }
        }
        if (!fs.existsSync(includeFile)) {
          logger.warn(name, `Unable to find file "${fileName}".`)
          match = regex.exec(content)
          continue
        }
        checksums[fileName] = utils.generateChecksum(fs.readFileSync(includeFile, { encoding: 'utf-8' }))
      }
      match = regex.exec(content)
    }
  }
  return checksums
}

function latexmk (resolver, directory, file) {
  try {
    execSync(`latexmk -lualatex "${file}"`, { cwd: directory })
    return true
  } catch (ex) {
    logger.fatal(name, ex)
    const logFile = resolver.resolve(directory, file.replace('.tex', '.log'))
    if (fs.existsSync(logFile)) {
      const logString = fs.readFileSync(logFile, { encoding: 'utf-8' }).toString()
      logger.fatal(name, 'Here is the log :')
      logger.fatal(name, logString)
    }
    return false
  }
}

function pdftocairo (resolver, directory, file) {
  const fileName = utils.getFileName(file)
  const svgFile = `${fileName}.svg`
  if (!debug.debug || !fs.existsSync(resolver.resolve(directory, svgFile))) {
    execSync(`pdftocairo -svg "${fileName}.pdf" "${svgFile}"`, { cwd: directory })
  }
  return svgFile
}
