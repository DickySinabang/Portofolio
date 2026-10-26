/** Builds "Start – End", or just one date if only one is known, or "" if none. */
export function formatPeriod(startDate?: string, endDate?: string): string {
  const start = startDate?.trim() ?? ''
  const end = endDate?.trim() ?? ''

  if (start && end) return `${start} – ${end}`
  return start || end
}