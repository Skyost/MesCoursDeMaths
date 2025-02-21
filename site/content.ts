// noinspection ES6PreferShortImport

import path from 'path'
import fs from 'fs'
import { getFilename } from '../utils/utils.js'
import type { LinkedResource } from '../types'

/**
 * Represents settings for handling the conversion of LaTeX files to HTML and PDF.
 */
interface SiteContentSettings {
  /**
   * Download destinations for the website previous build and data.
   */
  downloadDestinations: {
    previousBuild: string
    data: string
  }

  /**
   * Function to determine whether the given file should be transformed into a webpage thanks to Pandoc.
   */
  shouldBeTransformed: (filePath: string) => boolean

  /**
   * Directory path for LaTeX data files.
   */
  dataLatexDirectory: string

  /**
   * Directory path for storing LaTeX PDF files.
   */
  latexPdfDestinationDirectory: string

  /**
   * Directory path for storing LaTeX assets.
   */
  latexAssetsDestinationDirectoryName: string

  /**
   * Function to determine whether a file is an asset.
   */
  isAsset: (filePath: string) => boolean

  /**
   * Function to get the destination for a LaTeX document assets.
   */
  getLatexFileAssetsDestinationDirectoryPath: (assetDirectoryPath: string, latexFilePath: string) => string

  /**
   * Function to get the destination for an asset.
   */
  getAssetDestinationDirectoryPath: (assetDirectoryPath: string, filePath: string) => string

  /**
   * Function to generate all variants (print, uncompleted, ...) of a LaTeX file.
   */
  generateVariants: (filePath: string, fileContent: string) => null | Variant[]

  /**
   * Redefinitions for Pandoc.
   */
  pandocRedefinitionsFile: string

  /**
   * List of file paths to ignore during conversion.
   */
  ignores: string[]

  /**
   * Function to get directories for `includegraphics` in LaTeX files.
   */
  getIncludeGraphicsDirectories: (latexFilePath: string) => string[]

  /**
   * Template for picture resources (`tikzpicture` / `scratch` for instance).
   */
  picturesTemplate: { [key: string]: string }

  /**
   * Function to filter the file name of a LaTeX file.
   */
  filterFilename: (latexFilename: string) => string

  /**
   * Function to get linked resources for a LaTeX file.
   */
  getLinkedResources: (sourceDirectoryPath: string, latexFilePath: string) => LinkedResource[]
}

/**
 * Represents a LaTeX file variant.
 */
export interface Variant {
  /**
   * The variant file name.
   */
  filename: string
  /**
   * The variant file content.
   */
  fileContent: string
  /**
   * The variant type.
   */
  type: string
}

/**
 * Object containing site content settings.
 */
export const siteContentSettings: SiteContentSettings = {
  downloadDestinations: {
    previousBuild: 'node_modules/.previous-build',
    data: 'node_modules/.data'
  },
  shouldBeTransformed: (filePath: string) => {
    const filename = getFilename(filePath)
    return filename.endsWith('-cours') && path.extname(filePath) === '.tex'
  },
  dataLatexDirectory: 'latex',
  latexPdfDestinationDirectory: 'pdf',
  latexAssetsDestinationDirectoryName: 'images',
  getLatexFileAssetsDestinationDirectoryPath: (assetsDirectoryPath: string, latexFilePath: string): string => {
    return path.resolve(
      assetsDirectoryPath,
      path.basename(path.dirname(latexFilePath)),
      getFilename(latexFilePath)
    )
  },
  getAssetDestinationDirectoryPath: (assetsDirectoryPath: string, filePath: string): string => {
    const parent = path.dirname(filePath)
    if (getFilename(parent) === 'images') {
      const level = path.basename(path.dirname(parent))
      return path.resolve(
        assetsDirectoryPath,
        level
      )
    }
    else {
      const level = path.basename(path.dirname(path.dirname(parent)))
      return path.resolve(
        assetsDirectoryPath,
        level,
        path.basename(parent)
      )
    }
  },
  isAsset: (filePath: string) => {
    const parentDirectoryName = path.basename(path.dirname(filePath))
    if (parentDirectoryName !== 'images' && !parentDirectoryName.endsWith('-cours')) {
      return false
    }
    const extension = path.parse(filePath).ext
    return ['.pdf', '.svg', '.png', '.jpeg', '.jpg', '.gif'].includes(extension)
  },
  generateVariants: (filePath: string, fileContent: string) => {
    const filename = getFilename(filePath)
    if (filename === 'questions-flash') {
      return null
    }
    const regex = /\\documentclass(\[[A-Za-zÀ-ÖØ-öø-ÿ\d, =.\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\d/, .-]+)}/gs
    const filteredFilename = siteContentSettings.filterFilename(filename)
    const printVariant: Variant = {
      filename: `${filteredFilename}-impression`,
      fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../impression}'),
      type: 'impression'
    }
    const result = [printVariant]
    if (filename.endsWith('-cours')) {
      const studentVariant: Variant = {
        filename: `${filteredFilename}-eleve`,
        fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../eleve}'),
        type: 'élève'
      }
      const studentPrintVariant: Variant = {
        filename: `${filteredFilename}-eleve-impression`,
        fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../impression}\n\\include{../eleve}'),
        type: 'élève / impression'
      }
      result.push(studentVariant, studentPrintVariant)
    }
    return result
  },
  pandocRedefinitionsFile: 'pandoc.tex',
  ignores: [
    'devoir.tex',
    'eleve.tex',
    'geogebra.tex',
    'groupes.tex',
    'impression.tex',
    'pandoc.tex',
    'scratch.tex'
  ],
  getIncludeGraphicsDirectories: (latexFilePath: string): string[] => [
    path.resolve(path.dirname(latexFilePath), getFilename(latexFilePath)),
    path.dirname(latexFilePath)
  ],
  picturesTemplate: {
    scratch: `\\documentclass[tikz]{standalone}

% Load all required packages for my Scratch scripts.
\\usepackage{scratch3}

\\setscratch{scale=2.0}

% Graphics path.
{graphicsPath}

\\begin{document}
  % Content :
  {extractedContent}
\\end{document}
`,
    tikzpicture: `\\documentclass[tikz]{standalone}

% Load all required packages for my graphics.
\\usepackage{fourier-otf}
\\usepackage{fontspec}
\\usepackage{tkz-euclide}
\\usepackage{graphicx}
\\usepackage{gensymb}
\\usepackage{xlop}
\\usepackage{ifthen}
\\usepackage{xparse}
\\usepackage[group-separator={\\;}, group-minimum-digits=4]{siunitx}
\\usepackage{tkz-tab}

% Tables :

\\tikzset{t style/.style = {style = dashed}}

% Arrows :

\\tikzset{>={Latex[width=4pt]}}

% Options for xlop.
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

% Switch math font.
\\setmathfont{Erewhon Math}

% Load some tikz libraries.
\\usetikzlibrary{angles}
\\usetikzlibrary{patterns}
\\usetikzlibrary{intersections}
\\usetikzlibrary{shadows.blur}
\\usetikzlibrary{decorations.pathreplacing}
\\usetikzlibrary{ext.transformations.mirror}
\\usetikzlibrary{babel}

% Graphics path.
{graphicsPath}

% \\dddots command.
\\newcommand{\\dddots}[1]{\\makebox[#1]{\\dotfill}}
\\NewDocumentCommand{\\graphfonction}{O{1} O{1} m m m m O{\\x} O{f} O{0.5 below right}}{
  \\tikzgraph[#1][#2]{#3}{#4}{#5}{#6}
  \\begin{scope}
    \\clip (\\xmin,\\ymin) rectangle (\\xmax,\\ymax);
    \\draw[domain=\\xmin:\\xmax, variable=\\x, graphfonctionlabel=at #9 with {$\\color{teal} \\mathcal{C}_{#8}$}, thick, smooth, teal] plot ({\\x}, {(#7)});
  \\end{scope}
}

% \\tikzgraph command.
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

% Other commands.
\\newcommand{\\sipandoc}[2]{#1}
\\newcommand{\\siimpression}[2]{#2}
\\newcommand{\\sieleve}[2]{#2}

% 2.0x scale.
\\tikzset{
  graphfonctionlabel/.style args={at #1 #2 with #3}{
    postaction={
      decorate, decoration={markings, mark= at position #1 with \\node [#2] {#3};}
    }
  },
  every picture/.append style={scale=2.0, every node/.style={scale=2.0}}
}

\\begin{document}
  % Content.
  {extractedContent}
\\end{document}
`
  },
  filterFilename: (latexFilename: string) => {
    let suffixToRemove = '-cours'
    if (latexFilename.endsWith(suffixToRemove)) {
      return latexFilename.substring(0, latexFilename.length - suffixToRemove.length)
    }
    suffixToRemove = '-cours-impression'
    if (latexFilename.endsWith(suffixToRemove)) {
      return latexFilename.substring(0, latexFilename.length - suffixToRemove.length) + '-impression'
    }
    return latexFilename
  },
  getLinkedResources: (sourceDirectoryPath: string, latexFilePath: string): LinkedResource[] => {
    const filename = getFilename(latexFilePath)
    if (filename.endsWith('-cours')) {
      const result = []
      const prefix = siteContentSettings.filterFilename(filename)
      const files = fs.readdirSync(path.dirname(latexFilePath))
      const buildUrl = (baseUrl: string, file: string) => `/${siteContentSettings.latexPdfDestinationDirectory}/${baseUrl}/${siteContentSettings.filterFilename(getFilename(file))}.pdf`
      for (const file of files) {
        // We don't check for ignores here as there is no match in my setup.
        if (file.startsWith(prefix) && file.endsWith('.tex') && file !== filename) {
          const relativePath = path.relative(path.resolve(sourceDirectoryPath, siteContentSettings.downloadDestinations.data, siteContentSettings.dataLatexDirectory), latexFilePath)
          const baseUrl = path.dirname(relativePath).replace('\\', '/')
          if (filename + '.tex' === file) {
            result.push({
              title: 'Télécharger le PDF',
              url: buildUrl(baseUrl, file),
              isCurrentFile: true
            })
          }
          const title = getLinkedResourceTitle(prefix, file)
          if (title) {
            result.push({
              title,
              url: buildUrl(baseUrl, file)
            })
          }
        }
      }
      return result
    }
    return []
  }
}

const getLinkedResourceTitle = (prefix: string, filename: string) => {
  const resourceTypes = [
    {
      filenameRegex: RegExp(prefix + /-activite-([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)/.source),
      buildTitle: (match: RegExpExecArray) => `Activité ${match[1]}`
    },
    {
      filenameRegex: RegExp(prefix + /-evaluation/.source),
      buildTitle: (_: RegExpExecArray) => 'Évaluation'
    },
    {
      filenameRegex: RegExp(prefix + /-interrogation/.source),
      buildTitle: (_: RegExpExecArray) => 'Interrogation'
    },
    {
      filenameRegex: RegExp(prefix + /-dm/.source),
      buildTitle: (_: RegExpExecArray) => 'Devoir maison'
    }
  ]
  for (const resourceType of resourceTypes) {
    const match = resourceType.filenameRegex.exec(filename)
    if (match != null) {
      return resourceType.buildTitle(match)
    }
  }
  return null
}
