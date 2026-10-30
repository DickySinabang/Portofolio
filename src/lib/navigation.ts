/** Home is the top of "/", every other section is a hash on "/". */
export function getSectionPath(sectionId: string): string {
  return sectionId === 'home' ? '/' : `/#${sectionId}`
}

/**
 * The two-digit number of a section, matching the numbers shown in the navbar
 * ("02" for the second item). Returns undefined for sections that are not in
 * the navigation, such as Highlights.
 */
export function getSectionNumber(
  items: { sectionId: string }[],
  sectionId: string,
): string | undefined {
  const index = items.findIndex((item) => item.sectionId === sectionId)
  return index === -1 ? undefined : String(index + 1).padStart(2, '0')
}
