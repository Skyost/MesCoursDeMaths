import type { Ref } from 'vue'

/**
 * Represents an entry in the navigation tree.
 * @interface
 */
export interface NavigationEntry {
  /**
   * Title of the navigation entry.
   * @type {string}
   */
  title: string

  /**
   * URL or route to navigate to.
   * @type {string}
   */
  to: string

  /**
   * Depth level of the navigation entry in the tree.
   * @type {number}
   */
  depth: number
}

/**
 * Custom Vue composable to manage and retrieve navigation entries.
 * @returns {Ref<NavigationEntry[]>} - The reactive reference to the navigation entries.
 */
export const useNavigationEntries = (): Ref<NavigationEntry[]> => useState<NavigationEntry[]>('navigationEntries', () => [])

/**
 * Custom Vue composable to add a new navigation entry.
 * @param {NavigationEntry} newEntry - The new navigation entry to add.
 */
export const useNavigationEntry = (newEntry: NavigationEntry) => {
  let endIndex
  const entries = useNavigationEntries()

  // Find the index to truncate the entries based on depth
  for (let i = 0; i < entries.value.length; i++) {
    if (entries.value[i].depth === newEntry.depth) {
      endIndex = i - 1
      break
    }
  }

  // Truncate entries if necessary
  if (endIndex) {
    entries.value = endIndex < 0 ? [] : entries.value.slice(0, endIndex)
  }

  // Add the new entry if it should be added
  if (shouldAddNavigationEntry(newEntry)) {
    entries.value.push(newEntry)
  }
}

/**
 * Determines whether a new navigation entry should be added.
 * @param {NavigationEntry} newEntry - The new navigation entry to check.
 * @returns {boolean} - Whether the new entry should be added.
 */
const shouldAddNavigationEntry = (newEntry: NavigationEntry): boolean => {
  const entries = useNavigationEntries().value
  for (const entry of entries) {
    if (entry.to === newEntry.to) {
      return false
    }
  }
  return true
}
