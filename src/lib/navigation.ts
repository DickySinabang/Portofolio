/** Home is the top of "/", every other section is a hash on "/". */
export function getSectionPath(sectionId: string): string {
  return sectionId === 'home' ? '/' : `/#${sectionId}`
}