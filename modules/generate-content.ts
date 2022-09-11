import fs from 'fs'
import {execSync} from 'child_process'
import * as path from 'path'
import {parse} from 'node-html-parser'
import AdmZip from 'adm-zip'
import {Octokit} from '@octokit/core'
import fsExtra from 'fs-extra'
import katex from 'katex'
import matter from 'gray-matter'
import {$fetch} from 'ohmyfetch'
import {createResolver, defineNuxtModule} from '@nuxt/kit'
import Downloader from 'nodejs-file-downloader'
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

    const downloadDirectory = directories.downloadDirectory || nuxt.options.srcDir

    const lessonsDirectory = resolver.resolve(downloadDirectory, directories.lessonsDirectory)
    const pandocRedefinitions = resolver.resolve(lessonsDirectory, 'pandoc.tex')
    const extractedImagesDir = resolver.resolve(lessonsDirectory, '.extracted-images')

    const srcDir = nuxt.options.srcDir

    const imagesDestDir = resolver.resolve(nuxt.options.vite.publicDir.toString(), contentGenerator.imagesDestination)

    const imagesDirectories = Object.fromEntries(Object.entries(contentGenerator.imagesDirectories)
      .map(([imagesDir, destDir]) => [resolver.resolve(downloadDirectory, imagesDir), resolver.resolve(imagesDestDir, destDir)]))

    const ignored = contentGenerator.ignored
      .map(file => resolver.resolve(downloadDirectory, file))
      .concat(Object.keys(imagesDirectories))

    ignored.push(extractedImagesDir)
    ignored.push(pandocRedefinitions)

    await downloadRemoteDirectory(resolver, github, directories, lessonsDirectory)
    for (const [directory, destination] of Object.entries(imagesDirectories)) {
      await handleImages(resolver, directory, destination)
    }

    await processFiles(
      resolver,
      contentGenerator,
      lessonsDirectory,
      resolver.resolve(srcDir, 'content'),
      resolver.resolve(nuxt.options.vite.publicDir.toString(), contentGenerator.pdfDestination),
      contentGenerator.pdfDestination,
      extractedImagesDir,
      imagesDestDir,
      contentGenerator.imagesDestination,
      pandocRedefinitions,
      ignored
    )
    await handleImages(resolver, extractedImagesDir, imagesDestDir)
  }
})

async function downloadRemoteDirectory (resolver, github, directories, lessonsDirectory) {
  if (github.repository === github.dataRepository || fs.existsSync(lessonsDirectory)) {
    return
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
  fs.mkdirSync(tempDirectory)
  zip.extractAllTo(tempDirectory, true)
  const repoDirectory = utils.getDirectories(tempDirectory)[0]
  fsExtra.copySync(resolver.resolve(tempDirectory, repoDirectory, directories.lessonsDirectory), lessonsDirectory, {})
  fsExtra.removeSync(tempDirectory)
}

async function processFiles (resolver, contentGenerator, directory, mdDir, pdfDir, pdfDestURL, extractedImagesDir, imagesDestDir, imagesDestURL, pandocRedefinitions, ignored) {
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
        resolver.resolve(mdDir, file),
        resolver.resolve(pdfDir, file),
        `${pdfDestURL}/${file}`,
        resolver.resolve(extractedImagesDir, file),
        resolver.resolve(imagesDestDir, file),
        `${imagesDestURL}/${file}`,
        pandocRedefinitions,
        ignored
      )
    } else if (file.endsWith('.tex')) {
      logger.info(name, `Processing "${filePath}"...`)
      const fileName = utils.getFileName(file)
      fs.mkdirSync(mdDir, { recursive: true })
      const mdFile = resolver.resolve(mdDir, contentGenerator.fileNameFilter(fileName) + '.md')
      const imagesDir = resolver.resolve(imagesDestDir, fileName)
      if (contentGenerator.shouldGenerateMarkdown(fileName) && (!debug.debug || !fs.existsSync(mdFile))) {
        extractImages(resolver, contentGenerator, filePath, extractedImagesDir)
        const htmlContent = execSync(`pandoc "${path.relative(directory, pandocRedefinitions)}" "${filePath}" -t html --gladtex --number-sections --shift-heading-level-by=1 --html-q-tags`, {
          cwd: directory,
          encoding: 'utf-8'
        })
        const root = parse(htmlContent)
        const linkedResources = contentGenerator.getMarkdownLinkedResources(directory, file, pdfDestURL)
        replaceImages(resolver, root, imagesDir, imagesDestURL + '/' + fileName)
        replaceVspaceElements(root)
        adjustColSize(root)
        numberizeTitles(root)
        renderMath(root)
        fs.writeFileSync(mdFile, toString(contentGenerator.fileNameFilter(fileName), root, linkedResources))
      }
      if (contentGenerator.shouldGeneratePDF(fileName)) {
        const checksums = calculateTexFileChecksums(resolver, filePath, imagesDir)
        const pdfUrl = `${siteMeta.url}/${pdfDestURL}/${contentGenerator.fileNameFilter(fileName)}.pdf`
        fs.writeFileSync(resolver.resolve(directory, `${fileName}.pdf.checksums`), JSON.stringify(checksums))
        if (!debug.debug && await areRemoteChecksumsTheSame(checksums, pdfUrl)) {
          const downloader = new Downloader({
            url: pdfUrl,
            directory: pdfDir
          })
          await downloader.download()
        } else if (latexmk(resolver, directory, file)) {
          fs.mkdirSync(pdfDir, { recursive: true })
          fs.copyFileSync(resolver.resolve(directory, `${fileName}.pdf`), resolver.resolve(pdfDir, `${contentGenerator.fileNameFilter(fileName)}.pdf`))
          execSync('latexmk -quiet -c', { cwd: directory })
        }
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
    tikzImages[i].replaceWith(`<img src="/${imagesDestURL}/tikzpicture-${i + 1}.svg" class="extracted-image tikz-image" alt="Tikz ${i}">`)
  }
  const scratchImages = root.querySelectorAll('.scratch-image')
  for (let i = 0; i < scratchImages.length; i++) {
    scratchImages[i].replaceWith(`<img src="/${imagesDestURL}/scratch-${i + 1}.svg" class="extracted-image scratch-image" alt="Scratch ${i}">`)
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
    const sizeElement = row.querySelector('.first-col-size')
    const columns = row.querySelectorAll('.col')
    if (sizeElement && sizeElement.text.trim().length > 0 && columns.length === 2) {
      const size = parseFloat(sizeElement.text.trim())
      columns[0].setAttribute('style', `--column-size: ${size};`)
      columns[1].setAttribute('style', `--column-size: ${1 - size};`)
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

async function handleImages (resolver, imagesDir, imagesDestDir) {
  if (!fs.existsSync(imagesDir)) {
    return
  }
  const files = fs.readdirSync(imagesDir)
  for (const file of files) {
    const filePath = resolver.resolve(imagesDir, file)
    if (fs.lstatSync(filePath).isDirectory()) {
      await handleImages(resolver, filePath, resolver.resolve(imagesDestDir, file))
    } else if (file.endsWith('.tex')) {
      logger.info(name, `Handling image "${filePath}"...`)
      if (latexmk(resolver, imagesDir, file)) {
        const svgFile = pdftocairo(resolver, imagesDir, file)
        fs.mkdirSync(imagesDestDir, { recursive: true })
        fs.copyFileSync(resolver.resolve(imagesDir, svgFile), resolver.resolve(imagesDestDir, svgFile))
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

function calculateTexFileChecksums (resolver, file, imagesDir) {
  const fileName = utils.getFileName(file)
  const checksums = {}
  checksums[fileName] = utils.generateChecksum(fs.readFileSync(file, { encoding: 'utf-8' }))
  // eslint-disable-next-line prefer-regex-literals
  const regex = new RegExp('\\\\includegraphics(\\[[A-Za-zÀ-ÖØ-öø-ÿ\\d, =.]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\\d, .]+)}', 'gs')
  const content = fs.readFileSync(file, { encoding: 'utf-8' }).toString()
  let match = regex.exec(content)
  while (match != null) {
    const image = match[2]
    let imageFile = resolver.resolve(imagesDir, match[2])
    if (!fs.existsSync(imageFile)) {
      for (const extension of ['.png', '.jpeg', '.jpg', '.svg']) {
        if (fs.existsSync(`${imageFile}${extension}`)) {
          imageFile = `${imageFile}${extension}`
          break
        }
      }
      if (!fs.existsSync(imageFile)) {
        logger.warn(name, `Unable to find image "${image}".`)
        continue
      }
    }
    checksums[image] = utils.generateChecksum(fs.readFileSync(imageFile, { encoding: 'utf-8' }))
    match = regex.exec(content)
  }
  return checksums
}

async function areRemoteChecksumsTheSame (checksums, pdfUrl) {
  try {
    const remoteChecksums = await $fetch(`${pdfUrl}.checksums`)
    return checksums === remoteChecksums
  } catch (ex) {}
  return false
}

function latexmk (resolver, directory, file) {
  try {
    if (debug.debug && fs.existsSync(resolver.resolve(directory, file.replace('.tex', '.pdf')))) {
      return false
    }
    execSync(`latexmk -lualatex "${file}"`, { cwd: directory })
    return true
  } catch (ex) {
    logger.error(name, ex)
    const logFile = resolver.resolve(directory, file.replace('.tex', '.log'))
    if (fs.existsSync(logFile)) {
      const logString = fs.readFileSync(logFile, { encoding: 'utf-8' }).toString()
      logger.error(name, 'Here is the log :')
      logger.error(name, logString)
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
