import { describe, expect, it } from 'vitest'
import { testAbout, testExperience, testProfile } from '../test/fixtures'
import { buildPath } from './about'

describe('buildPath', () => {
  it('goes from education, through experience, to career', () => {
    const path = buildPath({ about: testAbout, experience: testExperience, profile: testProfile })

    expect(path.map((node) => node.label)).toEqual(['Education', 'Experience', 'Career'])
    expect(path[0]).toMatchObject({ title: 'Graduate', detail: 'Test University' })
    expect(path[1]).toMatchObject({
      title: 'Intern',
      detail: 'Test Corp',
      period: 'Jan 2025 – Jun 2025',
    })
    expect(path[2]).toMatchObject({ title: 'Test Developer', detail: 'Present' })
  })

  it('does not repeat the degree from the About card', () => {
    const path = buildPath({ about: testAbout, experience: testExperience, profile: testProfile })

    expect(path.some((node) => node.title === 'BSc Test')).toBe(false)
  })

  it('uses the employment type as the label when there is one', () => {
    const experience = [{ ...testExperience[0], employmentType: 'Internship' }]
    const path = buildPath({ about: testAbout, experience, profile: testProfile })

    expect(path[1].label).toBe('Internship')
  })

  it('still works with no experience at all', () => {
    const path = buildPath({ about: testAbout, experience: [], profile: testProfile })

    expect(path.map((node) => node.id)).toEqual(['education', 'career'])
  })

  it('includes every experience entry, in the listed order', () => {
    const experience = [
      { ...testExperience[0], id: 'first', position: 'First role' },
      { ...testExperience[0], id: 'second', position: 'Second role' },
    ]
    const path = buildPath({ about: testAbout, experience, profile: testProfile })

    expect(path.map((node) => node.title)).toEqual([
      'Graduate',
      'First role',
      'Second role',
      'Test Developer',
    ])
  })
})