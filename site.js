export default {
  site: {
    title: 'Mes cours de maths',
    description: 'Petit site web où je mets tous mes cours à disposition ainsi que les ressources qui y sont liés.',
    author: 'Hugo Delaunay',
    url: 'https://mes-cours-de-maths.fr',
    apiUrl: 'https://vercel.mes-cours-de-maths.fr/api'
  },
  github: {
    username: 'Skyost',
    repository: 'MesCoursDeMaths',
    dataRepository: 'Cours-HD',
    authentication: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      cookieExpirationDays: process.env.DEBUG_MODE ? 365 : 1
    },
    debug: {
      pasteBinApiKey: process.env.PASTEBIN_API_KEY
    },
    lessonsDirectory: 'latex/',
    calendarFile: 'calendar.json',
    downloadDirectory: process.env.GITHUB_DOWNLOAD_DIRECTORY || __dirname
  },
  encryptionKey: process.env.ENCRYPTION_KEY,
  debug: process.env.DEBUG_MODE === 'true',
  contentGenerator: {
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

      const path = require('path')
      const getFileName = require('./modules/generate-content/utils').default.getFileName

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

\\graphicspath{{${latexImagesDir}}{${path.posix.join(latexImagesDir, getFileName(filePath))}}}

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
    shouldGeneratePDF: () => true,
    getMarkdownLinkedResources (directory, file, pdfDestURL) {
      const path = require('path')
      const fs = require('fs')
      const getFileName = require('./modules/generate-content/utils').default.getFileName

      const fileName = getFileName(file)
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
                url: `${pdfDestURL}/${this.fileNameFilter(getFileName(directoryFile))}.pdf`
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
}
