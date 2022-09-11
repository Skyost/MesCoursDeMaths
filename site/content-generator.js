import path from 'path'
import fs from 'fs'
import utils from '../utils/utils'

export default {
  pdfDestination: 'pdf',
  imagesDestination: 'images/lessons',
  imagesDirectories: {
    'latex/sixieme/images': 'sixieme',
    'latex/cinquieme/images': 'cinquieme',
    'latex/quatrieme/images': 'quatrieme',
    'latex/troisieme/images': 'troisieme'
  },
  imagesToExtract: ['tikzpicture', 'scratch'],
  generateExtractedImageFileContent (imagesDir, filePath, blockType, content) {
    if (blockType === 'scratch') {
      return `\\documentclass{standalone}

\\usepackage{scratch3}

\\begin{document}
  ${content}
\\end{document}
`
    }

    const latexImagesDir = path.posix.join(path.relative(imagesDir, path.dirname(filePath)).split(path.sep).join(path.posix.sep), 'images')
    return `\\documentclass[tikz]{standalone}

\\usepackage{tikz}
\\usepackage{fourier-otf}
\\usepackage{fontspec}
\\usepackage{tkz-euclide}
\\usepackage{pgfplots}
\\usepackage{pgf-pie}
\\usepackage{graphicx}
\\usepackage{gensymb}

\\setmathfont{Erewhon Math}

\\usetikzlibrary{angles}
\\usetikzlibrary{patterns}
\\usetikzlibrary{intersections}
\\usetikzlibrary{shadows.blur}
\\usetikzlibrary{decorations.pathreplacing}
\\usetikzlibrary{babel}

\\graphicspath{{${latexImagesDir}}{${path.posix.join(latexImagesDir, utils.getFileName(filePath))}}}

\\newcommand{\\dddots}[1]{\\makebox[#1]{\\dotfill}}

\\begin{document}
  ${content}
\\end{document}
`
  },
  fileNameFilter (fileName) {
    if (fileName.endsWith('-cours')) {
      return fileName.substring(0, fileName.length - '-cours'.length)
    }
    return fileName
  },
  shouldGenerateMarkdown: fileName => fileName.endsWith('-cours'),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldGeneratePDF: fileName => true,
  getMarkdownLinkedResources (directory, file, pdfDestURL) {
    const fileName = utils.getFileName(file)
    if (fileName.endsWith('-cours')) {
      const result = []
      const prefix = this.fileNameFilter(fileName)
      const files = fs.readdirSync(directory)
      for (const directoryFile of files) {
        const filePath = path.resolve(directory, directoryFile)
        if (directoryFile.startsWith(prefix) && directoryFile.endsWith('.tex') && !directoryFile.includes('interrogation') && directoryFile !== file && this.shouldGeneratePDF(directoryFile)) {
          const regex = /\\cours(\[[a-z ]*])?\{[A-Za-zÀ-ÖØ-öø-ÿ\d, ]+}\{([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)}/
          const content = fs.readFileSync(filePath, { encoding: 'utf-8' }).toString()
          const match = regex.exec(content)
          if (match != null) {
            const title = match[2]
            result.push({
              title,
              url: `${pdfDestURL}/${this.fileNameFilter(utils.getFileName(directoryFile))}.pdf`
            })
          }
        }
      }
      return result
    }
    return []
  },
  ignored: [
    'latex/eleve.tex',
    'latex/geogebra.tex',
    'latex/groupes.tex',
    'latex/impression.tex',
    'latex/scratch.tex'
  ]
}