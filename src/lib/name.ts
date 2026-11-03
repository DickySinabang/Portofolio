export type DisplaySize = 'xl' | 'lg' | 'md' | 'sm'

export function splitName(name: string): string[] {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1) return words

  let bestIndex = 1
  let bestLongest = Infinity
  for (let index = 1; index < words.length; index++) {
    const longest = Math.max(
      words.slice(0, index).join(' ').length,
      words.slice(index).join(' ').length,
    )
    if (longest <= bestLongest) {
      bestLongest = longest
      bestIndex = index
    }
  }
  return [words.slice(0, bestIndex).join(' '), words.slice(bestIndex).join(' ')]
}

export function getDisplaySize(lines: string[]): DisplaySize {
  const longest = Math.max(0, ...lines.map((line) => line.length))
  if (longest <= 9) return 'xl'
  if (longest <= 13) return 'lg'
  if (longest <= 18) return 'md'
  return 'sm'
}
