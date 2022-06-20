import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import { parse } from 'node-html-parser'
import site from '../../site'
import utils from './utils'

const AdmZip = require('adm-zip')
const { Octokit } = require('@octokit/core')
const fsExtra = require('fs-extra')
const katex = require('katex')
const matter = require('gray-matter')
const logger = require('../../utils/logger')

module.exports = function () {
  this.nuxt.hook('build:compile', async ({ name }) => {
    if (name === 'server') {
      const downloadDirectory = site.github.downloadDirectory || this.nuxt.options.srcDir

      const lessonsDirectory = path.resolve(downloadDirectory, site.github.lessonsDirectory)
      const pandocRedefinitions = path.resolve(lessonsDirectory, 'pandoc.tex')
      const extractedImagesDir = path.resolve(lessonsDirectory, '.extracted-images')

      const srcDir = this.nuxt.options.srcDir

      const imagesDestDir = path.resolve(srcDir, 'static', site.contentGenerator.imagesDestination)

      const imagesDirectories = Object.fromEntries(Object.entries(site.contentGenerator.imagesDirectories)
        .map(([imagesDir, destDir]) => [path.resolve(downloadDirectory, imagesDir), path.resolve(imagesDestDir, destDir)]))

      const ignored = site.contentGenerator.ignored
        .map(file => path.resolve(downloadDirectory, file))
        .concat(Object.keys(imagesDirectories))

      ignored.push(extractedImagesDir)
      ignored.push(pandocRedefinitions)

      await downloadRemoteDirectory(lessonsDirectory)
      for (const [directory, destination] of Object.entries(imagesDirectories)) {
        await handleImages(directory, destination)
      }
      await processFiles(
        lessonsDirectory,
        path.resolve(srcDir, 'content'),
        path.resolve(srcDir, 'static', site.contentGenerator.pdfDestination),
        site.contentGenerator.pdfDestination,
        extractedImagesDir,
        imagesDestDir,
        site.contentGenerator.imagesDestination,
        pandocRedefinitions,
        ignored
      )
      await handleImages(extractedImagesDir, imagesDestDir)
    }
  })
}

async function downloadRemoteDirectory (lessonsDirectory) {
  if (site.github.repository === site.github.dataRepository || fs.existsSync(lessonsDirectory)) {
    return
  }
  logger.info(`Downloading and unzipping ${site.github.username}/${site.github.dataRepository}...`)
  const octokit = new Octokit({ auth: site.github.authentication.accessToken })
  const response = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    ref: 'main'
  })
  const zip = new AdmZip(Buffer.from(response.data))
  const tempDirectory = path.resolve(site.github.downloadDirectory, 'temp')
  fs.mkdirSync(tempDirectory)
  zip.extractAllTo(tempDirectory, true)
  const repoDirectory = utils.getDirectories(tempDirectory)[0]
  fsExtra.copySync(path.resolve(tempDirectory, repoDirectory, site.github.lessonsDirectory), lessonsDirectory, {})
  fsExtra.removeSync(tempDirectory)
}

async function processFiles (directory, mdDir, pdfDir, pdfDestURL, extractedImagesDir, imagesDestDir, imagesDestURL, pandocRedefinitions, ignored) {
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const filePath = path.resolve(directory, file)
    if (!fs.existsSync(filePath) || ignored.includes(filePath)) {
      continue
    }
    if (fs.lstatSync(filePath).isDirectory()) {
      await processFiles(
        filePath,
        path.resolve(mdDir, file),
        path.resolve(pdfDir, file),
        `${pdfDestURL}/${file}`,
        path.resolve(extractedImagesDir, file),
        path.resolve(imagesDestDir, file),
        `${imagesDestURL}/${file}`,
        pandocRedefinitions,
        ignored
      )
    } else if (file.endsWith('.tex')) {
      logger.info(`Processing "${filePath}"...`)
      const fileName = utils.getFileName(file)
      fs.mkdirSync(mdDir, { recursive: true })
      const mdFile = path.resolve(mdDir, site.contentGenerator.fileNameFilter(fileName) + '.md')
      if (site.contentGenerator.shouldGenerateMarkdown(fileName) && (!site.debug || !fs.existsSync(mdFile))) {
        extractImages(filePath, extractedImagesDir)
        const htmlContent = execSync(`pandoc "${path.relative(directory, pandocRedefinitions)}" "${filePath}" -t html --gladtex --number-sections --shift-heading-level-by=1 --html-q-tags`, {
          cwd: directory,
          encoding: 'utf-8'
        })
        const root = parse(htmlContent)
        const linkedResources = site.contentGenerator.getMarkdownLinkedResources(directory, file, pdfDestURL)
        replaceImages(root, path.resolve(imagesDestDir, fileName), imagesDestURL + '/' + fileName)
        replaceVspaceElements(root)
        adjustColSize(root)
        numberizeTitles(root)
        renderMath(root)
        fs.writeFileSync(mdFile, toString(site.contentGenerator.fileNameFilter(fileName), root, linkedResources))
      }
      if (site.contentGenerator.shouldGeneratePDF(fileName) && latexmk(directory, file)) {
        fs.mkdirSync(pdfDir, { recursive: true })
        fs.copyFileSync(path.resolve(directory, `${fileName}.pdf`), path.resolve(pdfDir, `${site.contentGenerator.fileNameFilter(fileName)}.pdf`))
        execSync('latexmk -quiet -c', { cwd: directory })
      }
    }
  }
}

function extractImages (filePath, extractedImagesDir) {
  const imagesDir = path.resolve(extractedImagesDir, utils.getFileName(filePath))
  for (const blockType of site.contentGenerator.imagesToExtract) {
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
      fs.writeFileSync(path.resolve(imagesDir, fileName), site.contentGenerator.generateExtractedImageFileContent(imagesDir, filePath, blockType, match[0]))
      i++
      match = regex.exec(content)
    }
  }
}

function replaceImages (root, imagesDestDir, imagesDestURL) {
  const images = root.querySelectorAll('img')
  for (const image of images) {
    const src = image.getAttribute('src')
    const extension = path.extname(src)
    if (extension === '') {
      image.setAttribute('alt', src)
      for (const testExtension of ['.svg', '.png', '.jpeg', '.jpg']) {
        if (fs.existsSync(path.resolve(imagesDestDir, src + testExtension))) {
          image.setAttribute('src', `${imagesDestURL}/${src}${testExtension}`)
          break
        }
      }
    }
  }
  const tikzImages = root.querySelectorAll('.tikz-image')
  for (let i = 0; i < tikzImages.length; i++) {
    tikzImages[i].replaceWith(`<img src="${imagesDestURL}/tikz-${i + 1}.svg" class="extracted-image tikz-image" alt="Tikz ${i}">`)
  }
  const scratchImages = root.querySelectorAll('.scratch-image')
  for (let i = 0; i < scratchImages.length; i++) {
    scratchImages[i].replaceWith(`<img src="${imagesDestURL}/scratch-${i + 1}.svg" class="extracted-image scratch-image" alt="Scratch ${i}">`)
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

async function handleImages (imagesDir, imagesDestDir) {
  if (!fs.existsSync(imagesDir)) {
    return
  }
  const files = fs.readdirSync(imagesDir)
  for (const file of files) {
    const filePath = path.resolve(imagesDir, file)
    if (fs.lstatSync(filePath).isDirectory()) {
      await handleImages(filePath, path.resolve(imagesDestDir, file))
    } else if (file.endsWith('.tex')) {
      logger.info(`Handling image "${filePath}"...`)
      if (latexmk(imagesDir, file)) {
        const svgFile = pdftocairo(imagesDir, file)
        fs.mkdirSync(imagesDestDir, { recursive: true })
        fs.copyFileSync(path.resolve(imagesDir, svgFile), path.resolve(imagesDestDir, svgFile))
      }
    } else if (file.endsWith('.pdf')) {
      const svgFile = pdftocairo(imagesDir, file)
      fs.mkdirSync(imagesDestDir, { recursive: true })
      fs.copyFileSync(path.resolve(imagesDir, svgFile), path.resolve(imagesDestDir, svgFile))
    } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      fs.mkdirSync(imagesDestDir, { recursive: true })
      fs.copyFileSync(path.resolve(imagesDir, file), path.resolve(imagesDestDir, file))
    }
  }
}

function toString (slug, root, linkedResources) {
  const header = {}
  const title = root.querySelector('.doctitle p')
  if (title) {
    header.name = title.innerHTML.trim()
    header['page-title'] = title.text.trim()
    header['page-title-search'] = utils.normalizeString(header['page-title'])
  }
  const summary = root.querySelector('.docsummary p')
  if (summary) {
    header.summary = summary.innerHTML.trim()
    header['page-description'] = summary.text.trim()
  }
  const number = root.querySelector('.docnumber p')
  if (number) {
    header.number = parseInt(number.innerHTML.trim())
  }
  header['linked-resources'] = linkedResources
  return matter.stringify(root.innerHTML, header)
}

function latexmk (directory, file) {
  try {
    if (site.debug && fs.existsSync(path.resolve(directory, file.replace('.tex', '.pdf')))) {
      return false
    }
    execSync(`latexmk -lualatex "${file}"`, { cwd: directory })
    return true
  } catch (ex) {
    logger.error(ex)
    const logFile = file.replace('.tex', '.log')
    if (fs.existsSync(logFile)) {
      logger.error('Here is the log :')
      logger.error(fs.readFileSync(logFile, { encoding: 'utf-8' }).toString())
    }
    return false
  }
}

function pdftocairo (directory, file) {
  const fileName = utils.getFileName(file)
  const svgFile = `${fileName}.svg`
  if (!site.debug || !fs.existsSync(path.resolve(directory, svgFile))) {
    execSync(`pdftocairo -svg "${fileName}.pdf" "${svgFile}"`, { cwd: directory })
  }
  return svgFile
}
