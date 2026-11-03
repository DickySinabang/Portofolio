import { describe, expect, it } from 'vitest'
import type { SkillCategory } from '../types/portfolio'
import { getAllSkills, pickUsedSkills } from './skills'

const categories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    skills: [
      { name: 'PHP', status: 'used' },
      { name: 'Python', status: 'used' },
      { name: 'Rust', status: 'learning' },
    ],
  },
  { id: 'empty', title: 'Empty', skills: [] },
  { id: 'db', title: 'Database', skills: [{ name: 'MySQL', status: 'used' }] },
  { id: 'ml', title: 'ML', skills: [{ name: 'Machine learning', status: 'learning' }] },
]

describe('pickUsedSkills', () => {
  it('takes one skill from each category in turn', () => {
    expect(pickUsedSkills(categories, 3)).toEqual(['PHP', 'MySQL', 'Python'])
  })

  it('never includes skills that are only being learned', () => {
    expect(pickUsedSkills(categories, 10)).toEqual(['PHP', 'MySQL', 'Python'])
  })

  it('respects the limit and handles no categories', () => {
    expect(pickUsedSkills(categories, 1)).toEqual(['PHP'])
    expect(pickUsedSkills([], 5)).toEqual([])
  })

  describe('getAllSkills', () => {
  it('flattens the categories in order and drops empty ones', () => {
    expect(getAllSkills(categories).map((skill) => skill.name)).toEqual([
      'PHP',
      'Python',
      'Rust',
      'MySQL',
      'Machine learning',
    ])
  })
    it('lists a repeated skill only once', () => {
      const repeated: SkillCategory[] = [
        { id: 'a', title: 'A', skills: [{ name: 'Git', status: 'used' }] },
        { id: 'b', title: 'B', skills: [{ name: 'git', status: 'used' }] },
      ]

      expect(getAllSkills(repeated)).toHaveLength(1)
    })
  })
})
