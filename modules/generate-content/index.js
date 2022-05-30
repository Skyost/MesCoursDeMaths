import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import { parse } from 'node-html-parser'
import tar from 'tar'
import site from '../../site'
import utils from './utils'

const { Octokit } = require('@octokit/core')
const fsExtra = require('fs-extra')
const katex = require('katex')
const matter = require('gray-matter')
const commandExistsSync = require('command-exists').sync
const logger = require('../../utils/logger')

const ignored = site.contentGenerator.ignored.map(file => path.resolve(file))

const pandocRedefinitions = path.resolve(`${site.github.lessonsDirectory}pandoc.tex`)
const imagesDir = path.resolve(`${site.github.lessonsDirectory}images`)
const tikzImagesDir = path.resolve(`${site.github.lessonsDirectory}tikz-images`)

ignored.push(pandocRedefinitions)
ignored.push(imagesDir)
ignored.push(tikzImagesDir)

module.exports = function () {
  this.nuxt.hook('build:compile', async function ({ name }) {
    if (name === 'server') {
      const srcDir = site.github.lessonsDirectory
      const mdDir = 'content/'
      const pdfDir = `static/${site.contentGenerator.pdfDestination}`
      const imagesDestDir = `static/${site.contentGenerator.imagesDestination}`
      const imagesDestURL = site.contentGenerator.imagesDestination

      await downloadRemoteDirectory(srcDir)
      await processFiles(srcDir, mdDir, pdfDir, tikzImagesDir, imagesDestURL)
      await handleImages(tikzImagesDir, imagesDestDir)
      await handleImages(imagesDir, imagesDestDir)
    }
  })
}

async function downloadRemoteDirectory (srcDir) {
  if (site.github.repository === site.github.dataRepository || fs.existsSync(srcDir)) {
    return
  }
  logger.info(`Downloading and unzipping ${site.github.username}/${site.github.dataRepository}...`)
  const repoTempFile = path.resolve('repoTemp.tar.gz')
  const tempDirectory = path.resolve('temp')
  const octokit = new Octokit({ auth: site.github.authentication.accessToken })
  const file = fs.createWriteStream(repoTempFile)
  const response = await octokit.request('GET /repos/{owner}/{repo}/tarball/{ref}', {
    owner: site.github.username,
    repo: site.github.dataRepository,
    ref: 'main'
  })
  file.write(Buffer.from(response.data))
  file.end()
  fs.mkdirSync(tempDirectory)
  await tar.extract({ file: repoTempFile, cwd: tempDirectory })
  const repoDirectory = utils.getDirectories(tempDirectory)[0]
  fsExtra.copySync(path.resolve(tempDirectory, repoDirectory, site.github.lessonsDirectory), srcDir, {})
  fsExtra.removeSync(repoTempFile)
  fsExtra.removeSync(path.resolve(tempDirectory))
}

async function processFiles (directory, mdDir, pdfDir, tikzImagesDir, imagesDestURL) {
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const filePath = path.resolve(directory, file)
    if (!fs.existsSync(filePath) || ignored.includes(filePath)) {
      continue
    }
    if (fs.lstatSync(filePath).isDirectory()) {
      await processFiles(filePath, path.resolve(mdDir, file), path.resolve(pdfDir, file), path.resolve(tikzImagesDir, file), imagesDestURL + '/' + file)
    } else if (file.endsWith('.tex')) {
      logger.info(`Processing "${filePath}"...`)
      const fileName = utils.getFileName(file)
      fs.mkdirSync(mdDir, { recursive: true })
      const mdFile = path.resolve(mdDir, site.contentGenerator.fileNameFilter(fileName) + '.md')
      if (site.contentGenerator.shouldGenerateMarkdown(fileName) && (!site.debug || !fs.existsSync(mdFile))) {
        extractImages(filePath, tikzImagesDir)
        const htmlContent = execSync(`pandoc "${path.relative(directory, pandocRedefinitions)}" "${filePath}" -t html --gladtex --number-sections --shift-heading-level-by=1 --html-q-tags`, {
          cwd: directory,
          encoding: 'utf-8'
        })
        const root = parse(htmlContent)
        adjustColSize(root)
        numberizeTitles(root)
        renderMath(root)
        replaceTikzImages(root, imagesDestURL + '/' + fileName)
        fs.writeFileSync(mdFile, toString(site.contentGenerator.fileNameFilter(fileName), root))
      }
      if (site.contentGenerator.shouldGeneratePDF(fileName) && latexmk(directory, file)) {
        fs.mkdirSync(pdfDir, { recursive: true })
        fs.copyFileSync(path.resolve(directory, `${fileName}.pdf`), path.resolve(pdfDir, `${site.contentGenerator.fileNameFilter(fileName)}.pdf`))
        execSync('latexmk -quiet -c', { cwd: directory })
      }
    }
  }
}

function extractImages (filePath, tikzImagesDir) {
  const imagesDir = path.resolve(tikzImagesDir, utils.getFileName(filePath))
  const regex = /\\begin{tikzpicture}([\s\S]*?)\\end{tikzpicture}/sg
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' }).toString()
  let match = regex.exec(content)
  if (match != null) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  let i = 1
  while (match != null) {
    const tikzPicture = match[0]
    const fileName = `tikz-${i}.tex`
    fs.writeFileSync(path.resolve(imagesDir, fileName), `\\documentclass[tikz]{standalone}

\\usepackage{tikz}
\\usepackage{fourier-otf}
\\usepackage{fontspec}
\\usepackage{tkz-euclide}

\\setmathfont{Erewhon Math}

\\begin{document}
  ${tikzPicture}
\\end{document}
`)
    i++
    match = regex.exec(content)
  }
}

function adjustColSize (root) {
  const rows = root.querySelectorAll('.row')
  for (const row of rows) {
    const sizeElement = row.querySelector('.first-col-size')
    const columns = row.querySelectorAll('.col')
    if (sizeElement && sizeElement.text.trim().length > 0 && columns.length === 2) {
      const size = parseFloat(sizeElement.text.trim())
      columns[0].setAttribute('style', `flex-grow: ${size}`)
      columns[1].setAttribute('style', `flex-grow: ${1 - size}`)
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
    if (mathElement.text.trim() === 'dotfill') {
      mathElement.replaceWith('<span class="dots"></span>')
    } else {
      mathElement.replaceWith(
        katex.renderToString(mathElement.text, {
          displayMode: mathElement.getAttribute('env') === 'displaymath',
          output: 'html',
          macros: {
            '\\parallelslant': '\\mathbin{\\!/\\mkern-5mu/\\!}'
          }
        })
      )
    }
  }
}

function replaceTikzImages (root, imagesDestURL) {
  const tikzImages = root.querySelectorAll('.tikz-image')
  for (let i = 0; i < tikzImages.length; i++) {
    tikzImages[i].replaceWith(`<img src="${imagesDestURL}/tikz-${i + 1}.svg" class="tikz-image" alt="Tikz ${i}">`)
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
        const fileName = utils.getFileName(file)
        const imageDestFile = path.resolve(imagesDestDir, `${fileName}.svg`)
        execSync(`pdftocairo -svg "${fileName}.pdf" "${fileName}.svg"`, { cwd: imagesDir })
        fs.mkdirSync(imagesDestDir, { recursive: true })
        fs.copyFileSync(path.resolve(imagesDir, `${fileName}.svg`), imageDestFile)
      }
    }
  }
}

function toString (slug, root) {
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
    header.number = number.innerHTML.trim()
  }
  return matter.stringify(root.innerHTML, header)
}

function latexmk (directory, file) {
  try {
    if (site.debug && fs.existsSync(path.resolve(directory, file.replace('.tex', '.pdf')))) {
      return false
    }
    if (commandExistsSync('texliveonfly')) {
      execSync(`texliveonfly --compiler=latexmk --arguments='-pdflatex=lualatex -pdf -shell-escape' "${file}"`, { cwd: directory })
    } else {
      execSync(`latexmk -pdflatex=lualatex -pdf -shell-escape "${file}"`, { cwd: directory })
    }
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
