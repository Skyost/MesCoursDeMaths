import fs from 'fs'
import path from 'path'

/**
 * The `\doc` macro found in a LaTeX document.
 */
export interface LatexDocMacro {
  /** Index of the first character of the macro. */
  beginIndex: number
  /** Index immediately after the macro and its arguments. */
  endIndex: number
  /** Title explicitly passed to the macro, if any. */
  explicitTitle?: string
}

/**
 * Finds the first `\doc` macro and understands both its current and legacy signatures.
 *
 * Supported forms are `\doc`, `\doc[title]` and the former `\doc{title}`.
 * The optional arguments that surrounded the legacy mandatory title are kept compatible too.
 *
 * @param content LaTeX source to inspect.
 * @returns The parsed macro, or `null` if none was found.
 */
export const findLatexDocMacro = (content: string): LatexDocMacro | null => {
  const match = /\\doc(?![A-Za-z@])(?:\s*\[([^\]]*)])?(?:\s*\{([^}]*)})?(?:\s*\[[^\]]*])?/.exec(content)
  if (!match) {
    return null
  }

  return {
    beginIndex: match.index,
    endIndex: match.index + match[0].length,
    explicitTitle: match[2] ?? match[1]
  }
}

/**
 * Resolves a document title just like the LaTeX `\doc` macro does.
 *
 * An explicit title takes precedence. Otherwise, the grade's `names.json` index is searched:
 * exact keys win, then the longest matching key ending in `*`.
 *
 * @param latexFilePath Path of the LaTeX document.
 * @param docMacro Parsed `\doc` macro from the document.
 * @returns The resolved title, or `undefined` when no title matches.
 */
export const resolveLatexDocumentTitle = (
  latexFilePath: string,
  docMacro: LatexDocMacro
): string | undefined => {
  if (docMacro.explicitTitle !== undefined) {
    return docMacro.explicitTitle
  }

  const namesFilePath = path.resolve(path.dirname(latexFilePath), 'names.json')
  if (!fs.existsSync(namesFilePath)) {
    return undefined
  }

  const names = JSON.parse(fs.readFileSync(namesFilePath, { encoding: 'utf8' })) as unknown
  if (typeof names !== 'object' || names === null || Array.isArray(names)) {
    throw new TypeError(`Expected "${namesFilePath}" to contain a JSON object.`)
  }

  const documentName = path.parse(latexFilePath).name
  const entries = Object.entries(names)
  const exactTitle = entries.find(([key]) => key === documentName)?.[1]
  if (typeof exactTitle === 'string') {
    return exactTitle
  }

  let title: string | undefined
  let longestPrefixLength = -1
  for (const [key, value] of entries) {
    if (typeof value !== 'string' || !key.endsWith('*')) {
      continue
    }

    const prefix = key.substring(0, key.length - 1)
    if (prefix.length > longestPrefixLength && documentName.startsWith(prefix)) {
      title = value
      longestPrefixLength = prefix.length
    }
  }
  return title
}

/**
 * Rewrites a `\doc` invocation to the legacy form understood by the Pandoc header.
 *
 * @param content Original LaTeX source.
 * @param docMacro Parsed `\doc` macro.
 * @param title Resolved document title.
 * @returns LaTeX source that Pandoc can transform without consuming the next command.
 */
export const setLatexDocMacroTitle = (
  content: string,
  docMacro: LatexDocMacro,
  title: string
): string => {
  return `${content.substring(0, docMacro.beginIndex)}\\doc{${title}}${content.substring(docMacro.endIndex)}`
}
