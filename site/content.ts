// noinspection ES6PreferShortImport

import path from 'path'
import fs from 'fs'
import { getFileName } from '../utils/utils.js'
import type { LinkedResource } from '../types'

/**
 * Represents settings for handling the conversion of LaTeX files to HTML and PDF.
 * @interface
 */
interface SiteContentSettings {
  /**
   * Download destinations for the website previous build and data.
   * @type {{ previousBuild: string, data: string }}
   */
  downloadDestinations: {
    previousBuild: string
    data: string
  }

  /**
   * Function to determine whether to copy downloaded files to content.
   * @type {(filePath: string) => boolean}
   */
  shouldCopyDownloadedFileToContent: (filePath: string) => boolean

  /**
   * Directory path for LaTeX data files.
   * @type {string}
   */
  dataLatexDirectory: string

  /**
   * Directory path for storing LaTeX PDF files.
   * @type {string}
   */
  latexPdfDestinationDirectory: string

  /**
   * Directory path for storing LaTeX assets.
   * @type {string}
   */
  latexAssetsDestinationDirectory: string

  /**
   * Function to determine whether a file is an asset.
   * @type {(filePath: string) => boolean}
   */
  isAsset: (filePath: string) => boolean

  /**
   * Should return the images directory of the given Latex document.
   * @type {(assetDirectoryPath: string, filePath: string) => string}
   */
  getLatexDocumentImagesDirectoryPath: (assetDirectoryPath: string, filePath: string) => string

  /**
   * Function to get the destination for LaTeX assets.
   * @type {(assetDirectoryPath: string, filePath: string, extractedFrom: string | null) => string}
   */
  getLatexAssetDestinationDirectoryPath: (assetDirectoryPath: string, filePath: string, extractedFrom: string | null) => string

  /**
   * Function to generate all variants (print, uncompleted, ...) of a LaTeX file.
   * @type {(filePath: string, fileContent: string) => null | { name: string, content: string }[]}
   */
  generateVariants: (filePath: string, fileContent: string) => null | Variant[]

  /**
   * Redefinitions for Pandoc.
   * @type {string}
   */
  pandocRedefinitions: string

  /**
   * List of file paths to ignore during conversion.
   * @type {string[]}
   */
  ignores: string[]

  /**
   * Function to get directories for `includegraphics` in LaTeX files.
   * @type {(latexFilePath: string) => string[]}
   */
  getIncludeGraphicsDirectories: (latexFilePath: string) => string[]

  /**
   * Template for picture resources (`tikzpicture` / `scratch` for instance).
   * @type {{[key: string]: string}}
   */
  picturesTemplate: { [key: string]: string }

  /**
   * Function to filter the file name of a LaTeX file.
   * @type {(latexFileName: string) => string}
   */
  filterFileName: (latexFileName: string) => string

  /**
   * Function to get linked resources for a LaTeX file.
   * @type {(sourceDirectoryPath: string, latexFilePath: string) => LinkedResource[]}
   */
  getLinkedResources: (sourceDirectoryPath: string, latexFilePath: string) => LinkedResource[]
}

/**
 * Represents a LaTeX file variant.
 */
export interface Variant {
  /**
   * The variant file name.
   * @type {string}
   */
  fileName: string
  /**
   * The variant file content.
   * @type {string}
   */
  fileContent: string
  /**
   * The variant type.
   * @type {string}
   */
  type: string
}

/**
 * Object containing site content settings.
 * @const {SiteContentSettings}
 * @export
 */
export const siteContentSettings: SiteContentSettings = {
  downloadDestinations: {
    previousBuild: 'node_modules/.previous-build',
    data: 'node_modules/.data'
  },
  shouldCopyDownloadedFileToContent: (filePath: string) => {
    const fileName = getFileName(filePath)
    return fileName.endsWith('-cours') && path.extname(filePath) === '.tex'
  },
  dataLatexDirectory: 'latex',
  latexPdfDestinationDirectory: 'pdf',
  latexAssetsDestinationDirectory: 'images',
  getLatexDocumentImagesDirectoryPath: (assetsDirectoryPath: string, filePath: string) => {
    const parent = path.dirname(filePath)
    const level = path.basename(path.dirname(path.dirname(parent)))
    return path.resolve(
      assetsDirectoryPath,
      level,
      path.basename(parent)
    )
  },
  getLatexAssetDestinationDirectoryPath: (assetsDirectoryPath: string, filePath: string, extractedFrom: string | null): string => {
    if (extractedFrom) {
      return path.resolve(
        assetsDirectoryPath,
        path.basename(path.dirname(extractedFrom)),
        getFileName(extractedFrom)
      )
    }
    const parent = path.dirname(filePath)
    if (getFileName(parent) === 'images') {
      const level = path.basename(path.dirname(parent))
      return path.resolve(
        assetsDirectoryPath,
        level
      )
    }
    return siteContentSettings.getLatexDocumentImagesDirectoryPath(assetsDirectoryPath, filePath)
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
    const fileName = getFileName(filePath)
    if (fileName === 'questions-flash') {
      return null
    }
    const regex = /\\documentclass(\[[A-Za-zÀ-ÖØ-öø-ÿ\d, =.\\-]*])?{([A-Za-zÀ-ÖØ-öø-ÿ\d/, .-]+)}/gs
    const filteredFileName = siteContentSettings.filterFileName(fileName)
    const printVariant: Variant = {
      fileName: `${filteredFileName}-impression`,
      fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../impression}'),
      type: 'impression'
    }
    const result = [printVariant]
    if (fileName.endsWith('-cours')) {
      const studentVariant: Variant = {
        fileName: `${filteredFileName}-eleve`,
        fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../eleve}'),
        type: 'élève'
      }
      const studentPrintVariant: Variant = {
        fileName: `${filteredFileName}-eleve-impression`,
        fileContent: fileContent.replace(regex, '\\documentclass$1{$2}\n\n\\include{../impression}\n\\include{../eleve}'),
        type: 'élève / impression'
      }
      result.push(studentVariant, studentPrintVariant)
    }
    return result
  },
  pandocRedefinitions: 'pandoc.tex',
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
    path.resolve(path.dirname(latexFilePath), siteContentSettings.latexAssetsDestinationDirectory, path.parse(latexFilePath).name),
    path.dirname(latexFilePath)
  ],
  picturesTemplate: {
    scratch: `\\documentclass[tikz]{standalone}

% Load all required packages for my Scratch scripts.
\\usepackage{scratch3}

\\setscratch{scale=2.25}

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

% 2.25x scale.
\\tikzset{
  graphfonctionlabel/.style args={at #1 #2 with #3}{
    postaction={
      decorate, decoration={markings, mark= at position #1 with \\node [#2] {#3};}
    }
  },
  every picture/.append style={scale=2.25, every node/.style={scale=2.25}}
}

\\begin{document}
  % Content.
  {extractedContent}
\\end{document}
`
  },
  filterFileName: (latexFileName: string) => {
    let suffixToRemove = '-cours'
    if (latexFileName.endsWith(suffixToRemove)) {
      return latexFileName.substring(0, latexFileName.length - suffixToRemove.length)
    }
    suffixToRemove = '-cours-impression'
    if (latexFileName.endsWith(suffixToRemove)) {
      return latexFileName.substring(0, latexFileName.length - suffixToRemove.length) + '-impression'
    }
    return latexFileName
  },
  getLinkedResources: (sourceDirectoryPath: string, latexFilePath: string): LinkedResource[] => {
    const fileName = getFileName(latexFilePath)
    if (fileName.endsWith('-cours')) {
      const result = []
      const prefix = siteContentSettings.filterFileName(fileName)
      const files = fs.readdirSync(path.dirname(latexFilePath))
      const buildUrl = (baseUrl: string, file: string) => `/${siteContentSettings.latexPdfDestinationDirectory}/${baseUrl}/${siteContentSettings.filterFileName(getFileName(file))}.pdf`
      for (const file of files) {
        // We don't check for ignores here as there is no match in my setup.
        if (file.startsWith(prefix) && file.endsWith('.tex') && file !== fileName) {
          const relativePath = path.relative(path.resolve(sourceDirectoryPath, siteContentSettings.downloadDestinations.data, siteContentSettings.dataLatexDirectory), latexFilePath)
          const baseUrl = path.dirname(relativePath).replace('\\', '/')
          if (fileName + '.tex' === file) {
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

const getLinkedResourceTitle = (prefix: string, fileName: string) => {
  const resourceTypes = [
    {
      fileNameRegex: RegExp(prefix + /-activite-([A-Za-zÀ-ÖØ-öø-ÿ\d, ]+)/.source),
      buildTitle: (match: RegExpExecArray) => `Activité ${match[1]}`
    },
    {
      fileNameRegex: RegExp(prefix + /-evaluation/.source),
      buildTitle: (_: RegExpExecArray) => 'Évaluation'
    },
    {
      fileNameRegex: RegExp(prefix + /-interrogation/.source),
      buildTitle: (_: RegExpExecArray) => 'Interrogation'
    },
    {
      fileNameRegex: RegExp(prefix + /-dm/.source),
      buildTitle: (_: RegExpExecArray) => 'Devoir maison'
    }
  ]
  for (const resourceType of resourceTypes) {
    const match = resourceType.fileNameRegex.exec(fileName)
    if (match != null) {
      return resourceType.buildTitle(match)
    }
  }
  return null
}
