import { describe, expect, it } from 'vitest'
import { getSectionPath } from './navigation'
import { formatPeriod } from './period'
import { getVisibleSkillCategories } from './skills'
import { testSkillCategories } from '../test/fixtures'

describe('getSectionPath', () => {
  it('maps home to "/" and other sections to hash links', () => {
    expect(getSectionPath('home')).toBe('/')
    expect(getSectionPath('about')).toBe('/#about')
  })
})

describe('formatPeriod', () => {
  it('joins start and end dates', () => {
    expect(formatPeriod('Jul 2025', 'Dec 2025')).toBe('Jul 2025 – Dec 2025')
  })

  it('shows a single date when only one is known', () => {
    expect(formatPeriod('Jul 2025')).toBe('Jul 2025')
    expect(formatPeriod(undefined, 'Present')).toBe('Present')
  })

  it('returns an empty string when nothing is known', () => {
    expect(formatPeriod()).toBe('')
    expect(formatPeriod('  ', '')).toBe('')
  })
})

describe('getVisibleSkillCategories', () => {
  it('drops categories that have no skills', () => {
    const visible = getVisibleSkillCategories(testSkillCategories)
    expect(visible.map((category) => category.id)).toEqual(['frontend'])
  })
})