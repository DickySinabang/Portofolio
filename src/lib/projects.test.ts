import { describe, expect, it } from 'vitest'
import { backendProject, fullProject, minimalProject } from '../test/fixtures'
import {
  cleanUrl,
  filterProjects,
  findProjectBySlug,
  getProjectCategories,
  sortProjects,
} from './projects'

const all = [fullProject, minimalProject, backendProject]

describe('getProjectCategories', () => {
  it('returns only categories that have projects, in display order', () => {
    expect(getProjectCategories(all)).toEqual(['web', 'backend', 'iot'])
  })

  it('returns nothing when there are no projects', () => {
    expect(getProjectCategories([])).toEqual([])
  })
})

describe('filterProjects', () => {
  it('returns everything for "all"', () => {
    expect(filterProjects(all, 'all')).toHaveLength(3)
  })

  it('returns only matching projects for a category', () => {
    expect(filterProjects(all, 'iot')).toEqual([minimalProject])
  })

  it('returns an empty list for a category with no projects', () => {
    expect(filterProjects(all, 'mobile')).toEqual([])
  })
})

describe('sortProjects', () => {
  it('puts featured projects first and keeps the rest in order', () => {
    expect(sortProjects(all).map((project) => project.slug)).toEqual([
      'api-project',
      'full-project',
      'minimal-project',
    ])
  })

  it('does not change the original array', () => {
    sortProjects(all)
    expect(all.map((project) => project.slug)).toEqual([
      'full-project',
      'minimal-project',
      'api-project',
    ])
  })
})

describe('findProjectBySlug', () => {
  it('finds a project by its slug', () => {
    expect(findProjectBySlug(all, 'full-project')).toBe(fullProject)
  })

  it('returns undefined for an unknown or missing slug', () => {
    expect(findProjectBySlug(all, 'nope')).toBeUndefined()
    expect(findProjectBySlug(all, undefined)).toBeUndefined()
  })
})

describe('cleanUrl', () => {
  it('trims whitespace and treats blanks as empty', () => {
    expect(cleanUrl('  https://example.com  ')).toBe('https://example.com')
    expect(cleanUrl('   ')).toBe('')
    expect(cleanUrl(undefined)).toBe('')
  })
})