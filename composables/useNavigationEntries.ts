export interface NavigationEntry {
    title: string,
    to: string,
    depth: number
}

export const useNavigationEntries = () => useState<NavigationEntry[]>('navigationEntries', () => [])

export const useNavigationEntry = (newEntry: NavigationEntry) => {
  let endIndex
  const entries = useNavigationEntries()
  for (let i = 0; i < entries.value.length; i++) {
    if (entries.value[i].depth === newEntry.depth) {
      endIndex = i - 1
      break
    }
  }
  if (endIndex) {
    entries.value = endIndex < 0 ? [] : entries.value.slice(0, endIndex)
  }
  if (shouldAddNavigationEntry(newEntry)) {
    entries.value.push(newEntry)
  }
}

const shouldAddNavigationEntry = (newEntry: NavigationEntry) => {
  const entries = useNavigationEntries().value
  for (const entry of entries) {
    if (entry.to === newEntry.to) {
      return false
    }
  }
  return true
}
