// noinspection ES6PreferShortImport

import path from 'path'
import fs from 'fs'
import type { GradeWithResources } from '../../app/types'

/**
 * Represents the name of the destination directory where LaTeX-related assets, such as images, are stored.
 */
const assetsDestinationDirectoryName: string = 'images'

/**
 * Determines if a given file path corresponds to an asset file based on its parent directory name and file extension.
 *
 * @param filePath The file path to be evaluated.
 * @returns Returns true if the file is considered an asset, otherwise false.
 */
const isAsset = (filePath: string): boolean => {
  const parentDirectoryName = path.basename(path.dirname(filePath))
  if (parentDirectoryName !== 'images' && !parentDirectoryName.endsWith('-cours')) {
    return false
  }
  const extension = path.parse(filePath).ext
  return ['.pdf', '.svg', '.png', '.jpeg', '.jpg', '.gif'].includes(extension)
}

/**
 * Constructs and returns the destination directory path for LaTeX file assets.
 *
 * @param assetsDirectoryPath The base directory path where assets are stored.
 * @param latexFilePath The file path to the LaTeX file whose assets destination directory needs to be constructed.
 * @returns The resolved destination directory path for the assets of the provided LaTeX file.
 */
const getLatexFileAssetsDestinationDirectoryPath = (assetsDirectoryPath: string, latexFilePath: string): string => {
  return path.resolve(
    assetsDirectoryPath,
    path.basename(path.dirname(latexFilePath)),
    path.parse(latexFilePath).name
  )
}

/**
 * Constructs the destination directory path for an asset based on its file path and a specified assets directory path.
 *
 * @param assetsDirectoryPath The base directory where assets will be stored.
 * @param filePath The file path of the asset being processed.
 * @returns The constructed path for the destination directory of the asset.
 */
const getAssetDestinationDirectoryPath = (assetsDirectoryPath: string, filePath: string): string => {
  const parent = path.dirname(filePath)
  if (path.parse(parent).name === 'images') {
    const gradeId = path.basename(path.dirname(parent))
    return path.resolve(
      assetsDirectoryPath,
      gradeId
    )
  }
  else {
    const gradeId = path.basename(path.dirname(path.dirname(parent)))
    return path.resolve(
      assetsDirectoryPath,
      gradeId,
      path.basename(parent)
    )
  }
}

/**
 * Reads and retrieves grade data along with associated resources.
 *
 * @param directoryPath The path to the directory containing the grade data files.
 * @returns Returns the grade data combined with its associated resources,
 * or null if the data is not found or an error occurs.
 */
const readGradeData = (directoryPath: string): GradeWithResources | null => {
  const gradeDataFilePath = path.resolve(directoryPath, 'grade.json')
  if (!fs.existsSync(gradeDataFilePath)) {
    return null
  }
  const grade = JSON.parse(fs.readFileSync(gradeDataFilePath, { encoding: 'utf-8' }))
  return grade as GradeWithResources
}

/**
 * Determines if a given file should be transformed based on its name and extension.
 *
 * @param filePath The full file path of the file to be evaluated.
 * @returns True if the file should be transformed, otherwise false.
 */
const shouldBeTransformed = (filePath: string): boolean => {
  const filename = path.parse(filePath).name
  return filename.endsWith('-cours') && path.extname(filePath) === '.tex'
}

/**
 * Represents the file of the Pandoc redefinitions file.
 *
 * This file is typically used to customize or redefine specific styles,
 * commands, or formatting options in Pandoc-generated output
 *
 * Usage of this variable implies the availability of the corresponding
 * file in the specified location, which contains necessary LaTeX
 * redefinitions or customizations compatible with Pandoc.
 */
const pandocRedefinitionsFile: string = 'pandoc.tex'

/**
 * An object containing LaTeX templates for rendering pictures using different configurations.
 *
 * The `picturesTemplate` object provides predefined LaTeX document class configurations,
 * packages, and commands required to generate graphical content. Each property holds a LaTeX
 * template string with placeholders for dynamic content insertion.
 */
const picturesTemplate: Record<string, string> = {
  /**
   * Template string for generating a LaTeX document utilizing the TikZ package and Scratch scripts.
   */
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
  /**
   * A string literal containing LaTeX code to render a standalone TikZ picture document.
   */
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
}

/**
 * A linked resource, linking to a file, and not to a given URL.
 */
export interface RawLinkedResource {
  /**
   * Title of the linked resource.
   */
  title: string
  /**
   * The LaTeX file path of the resource.
   */
  latexFilePath: string
  /**
   * Whether the linked resource represents the current lesson.
   * Only the first is taken into account.
   */
  isCurrentFile?: boolean
}

/**
 * Retrieves linked resources associated with a LaTeX file located in the provided directory.
 *
 * This function inspects files in the source directory and identifies LaTeX files that share a specific
 * naming pattern with the given file. For each matching file, it constructs necessary linked resource
 * metadata, including the title and URL pointing to a corresponding PDF file.
 *
 * @param latexFilePath The full file path of the target LaTeX file.
 * @returns An array of linked resource objects that contain metadata, such as the
 * title, URL, and whether the resource corresponds to the current LaTeX file.
 */
const getRawLinkedResources = (latexFilePath: string): RawLinkedResource[] => {
  const relevantPrefix = '-cours'
  const filename = path.parse(latexFilePath).name
  if (filename.endsWith(relevantPrefix)) {
    const result: RawLinkedResource[] = []
    const prefix = filename.substring(0, filename.length - relevantPrefix.length)
    const directoryPath = path.dirname(latexFilePath)
    const files = fs.readdirSync(directoryPath)
    for (const file of files) {
      // We don't check for ignores here as there is no match in my setup.
      if (file.startsWith(prefix) && file.endsWith('.tex') && file !== filename) {
        if (filename + '.tex' === file) {
          result.push({
            title: 'Télécharger le PDF',
            latexFilePath: path.resolve(directoryPath, file),
            isCurrentFile: true
          })
        }
        const title = getLinkedResourceTitle(prefix, file)
        if (title) {
          result.push({
            title,
            latexFilePath: path.resolve(directoryPath, file)
          })
        }
      }
    }
    return result
  }
  return []
}

/**
 * Determines the title of a linked resource based on a given filename and prefix.
 * The function matches the filename against a set of predefined patterns and, if a match is
 * found, generates a title corresponding to the identified resource type. If no pattern
 * matches the provided filename, the function returns null.
 *
 * @param prefix - The prefix used to construct the regular expressions for matching.
 * @param filename - The name of the file to test against the predefined patterns.
 * @returns The generated resource title if a match is found, otherwise null.
 */
const getLinkedResourceTitle = (prefix: string, filename: string): string | null => {
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

/**
 * Holds the default options for this module.
 */
const defaultOptions = {
  assetsDestinationDirectoryName,
  readGradeData,
  isAsset,
  getLatexFileAssetsDestinationDirectoryPath,
  getAssetDestinationDirectoryPath: getAssetDestinationDirectoryPath,
  shouldBeTransformed: shouldBeTransformed,
  pandocRedefinitionsFile,
  picturesTemplate,
  getRawLinkedResources,
  latexFilesUrl: '/_api/'
}

/**
 * The default options.
 */
export default defaultOptions

/**
 * Options for this module.
 */
export type ModuleOptions = typeof defaultOptions
