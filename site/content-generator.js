import path from 'path'
import fs from 'fs'
import utils from '../utils/utils'

export default {
  destinationUrl: '/cours',
  pdfDestination: 'pdf',
  imagesDestination: 'images/lessons',
  imagesDirectories: {
    'latex/sixieme/images': 'sixieme',
    'latex/cinquieme/images': 'cinquieme',
    'latex/quatrieme/images': 'quatrieme',
    'latex/troisieme/images': 'troisieme'
  },
  imagesToExtract: ['tikzpicture', 'scratch'],
  getLatexRelativeIncludedImagesDir (fileExtractedImagesDir, filePath) {
    return path.posix.join(path.relative(fileExtractedImagesDir, path.dirname(filePath)).split(path.sep).join(path.posix.sep), 'images', utils.getFileName(filePath))
  },
  generateExtractedImageFileContent (fileExtractedImagesDir, filePath, blockType, content) {
    if (blockType === 'scratch') {
      return `\\documentclass{standalone}

\\usepackage{scratch3}

\\setscratch{scale=1.5}

\\begin{document}
  ${content}
\\end{document}
`
    }

    const latexImagesDir = this.getLatexRelativeIncludedImagesDir(fileExtractedImagesDir, filePath)
    return `\\documentclass[tikz]{standalone}

\\usepackage{tikz}
\\usepackage{fourier-otf}
\\usepackage{fontspec}
\\usepackage{tkz-euclide}
\\usepackage{pgfplots}
\\usepackage{pgf-pie}
\\usepackage{graphicx}
\\usepackage{gensymb}
\\usepackage{xlop}
\\usepackage{ifthen}
\\usepackage{xparse}
\\usepackage[group-separator={\\;}, group-minimum-digits=4]{siunitx}

\\opset{%
  dividendbridge,%
  carrysub,%
  displayintermediary=all,%
  displayshiftintermediary=all,%
  voperator=bottom,%
  voperation=bottom,%
  decimalsepsymbol={,},%
  shiftdecimalsep=divisor%
}

\\setmathfont{Erewhon Math}

\\usetikzlibrary{angles}
\\usetikzlibrary{patterns}
\\usetikzlibrary{intersections}
\\usetikzlibrary{shadows.blur}
\\usetikzlibrary{decorations.pathreplacing}
\\usetikzlibrary{ext.transformations.mirror}
\\usetikzlibrary{babel}

\\graphicspath{{${latexImagesDir}}}

\\newcommand{\\dddots}[1]{\\makebox[#1]{\\dotfill}}
\\NewDocumentCommand{\\graphfonction}{O{1} O{1} m m m m O{\\x} O{f} O{0.5 below right}}{
  \\tikzgraph[#1][#2]{#3}{#4}{#5}{#6}
  \\begin{scope}
    \\clip (\\xmin,\\ymin) rectangle (\\xmax,\\ymax);
    \\draw[domain=\\xmin:\\xmax, variable=\\x, graphfonctionlabel=at #9 with {$\\color{teal} \\mathcal{C}_{#8}$}, thick, smooth, teal] plot ({\\x}, {(#7)});
  \\end{scope}
}

\\NewDocumentCommand{\\tikzgraph}{O{1} O{1} m m m m}{
  \\coordinate (O) at (0,0);

  \\pgfmathparse{#3-0.5}
  \\edef\\xmin{\\pgfmathresult}
  \\pgfmathparse{#4-0.5}
  \\edef\\ymin{\\pgfmathresult}
  \\pgfmathparse{#5+0.5}
  \\edef\\xmax{\\pgfmathresult}
  \\pgfmathparse{#6+0.5}
  \\edef\\ymax{\\pgfmathresult}

  \\draw[opacity=0.5,thin] (\\xmin,\\ymin) grid (\\xmax,\\ymax);
  \\foreach \\x in {#3,...,#5} {
    \\pgfmathparse{int(#1*\\x)}
    \\edef\\xlabel{\\pgfmathresult}
    \\ifthenelse{\\x = 0}{}{\\draw[opacity=0.5] (\\x,0.25) -- (\\x,-0.25) node {\\small $\\xlabel$}};
  }
  \\foreach \\y in {#4,...,#6} {
    \\pgfmathparse{int(#2*\\y)}
    \\edef\\ylabel{\\pgfmathresult}
    \\ifthenelse{\\y = 0}{}{\\draw[opacity=0.5] (0.25,\\y) -- (-0.25,\\y) node[shift={(-0.1,0)}] {\\small $\\ylabel$}};
  }
  \\draw[opacity=0.5] (0,0.25) -- (0,-0.25) node[shift={(-0.35,-0.1)}]{\\small $0$};
  \\draw[thick,->] (\\xmin,0) -- (\\xmax,0);
  \\draw[thick,->] (0,\\ymin) -- (0,\\ymax);
}

\\tikzset{
  graphfonctionlabel/.style args={at #1 #2 with #3}{
    postaction={
      decorate, decoration={markings, mark= at position #1 with \\node [#2] {#3};}
    }
  },
  every picture/.append style={scale=1.5, every node/.style={scale=1.5}}
}

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
  shouldHandleImagesOfDirectory: directory => directory.endsWith('-cours'),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldGeneratePdf: fileName => true,
  generatePrintVariant: (fileName, fileContent) => {
    if (fileName === 'questions-flash') {
      return null
    }
    const regex = /\\documentclass(\[[A-Za-zÀ-ÖØ-öø-ÿ\d, =.\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\d/, .-]+)}/gs
    return fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../impression}')
  },
  getMarkdownLinkedResources (directory, file, pdfDestURL) {
    const fileName = utils.getFileName(file)
    if (fileName.endsWith('-cours')) {
      const result = []
      const prefix = this.fileNameFilter(fileName)
      const files = fs.readdirSync(directory)
      for (const directoryFile of files) {
        if (directoryFile.startsWith(prefix) && directoryFile.endsWith('.tex') && directoryFile !== file && this.shouldGeneratePdf(directoryFile)) {
          const title = this.getMarkdownLinkedResourceTitle(prefix, directoryFile)
          if (title != null) {
            result.push({
              title,
              url: `/${pdfDestURL}/${this.fileNameFilter(utils.getFileName(directoryFile))}.pdf`
            })
          }
        }
      }
      return result
    }
    return []
  },
  getMarkdownLinkedResourceTitle (prefix, file) {
    const resourceTypes = [
      {
        fileNameRegex: RegExp(prefix + /-activite-([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)/.source),
        buildTitle: match => `Activité ${match[1]}`
      },
      {
        fileNameRegex: RegExp(prefix + /-evaluation/.source),
        buildTitle: _ => 'Évaluation'
      },
      {
        fileNameRegex: RegExp(prefix + /-interrogation/.source),
        buildTitle: _ => 'Interrogation'
      }
    ]
    for (const resourceType of resourceTypes) {
      const match = resourceType.fileNameRegex.exec(file)
      if (match != null) {
        return resourceType.buildTitle(match)
      }
    }
    return null
  },
  ignored: [
    'latex/eleve.tex',
    'latex/geogebra.tex',
    'latex/groupes.tex',
    'latex/impression.tex',
    'latex/scratch.tex'
  ]
}
