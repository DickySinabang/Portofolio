import { describe, expect, it } from 'vitest'
import { getSectionNumber, getSectionPath } from './navigation'

const items = [{ sectionId: 'home' }, { sectionId: 'about' }, { sectionId: 'projects' }]

describe('getSectionPath', () => {
  it('maps home to "/" and other sections to hash links', () => {
    expect(getSectionPath('home')).toBe('/')
    expect(getSectionPath('about')).toBe('/#about')
  })
})

describe('getSectionNumber', () => {
  it('numbers sections by their position in the navigation, starting at 01', () => {
    expect(getSectionNumber(items, 'home')).toBe('01')
    expect(getSectionNumber(items, 'projects')).toBe('03')
  })

  it('returns undefined for sections that are not in the navigation', () => {
    expect(getSectionNumber(items, 'highlights')).toBeUndefined()
  })
})
