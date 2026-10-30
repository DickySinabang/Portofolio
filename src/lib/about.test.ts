import { describe, expect, it } from 'vitest'
import { testAbout, testExperience, testProfile } from '../test/fixtures'
import { buildPath } from './about'

describe('buildPath', () => {
  it('goes from education, through experience, to the present', () => {
    const path = buildPath({ about: testAbout, experience: testExperience, profile: testProfile })

    expect(path.map((node) => node.label)).toEqual(['Education', 'Experience', 'Now'])
    expect(path[0]).toMatchObject({ title: 'BSc Test', detail: 'Test University' })
    expect(path[1]).toMatchObject({ title: 'Intern', detail: 'Test Corp' })
    expect(path[2]).toMatchObject({ title: 'Graduate', detail: 'Test Developer' })
  })

  it('uses the employment type as the label when there is one', () => {
    const experience = [{ ...testExperience[0], employmentType: 'Internship' }]
    const path = buildPath({ about: testAbout, experience, profile: testProfile })

    expect(path[1].label).toBe('Internship')
  })

  it('still works with no experience at all', () => {
    const path = buildPath({ about: testAbout, experience: [], profile: testProfile })

    expect(path.map((node) => node.id)).toEqual(['education', 'now'])
  })

  it('includes every experience entry, in the listed order', () => {
    const experience = [
      { ...testExperience[0], id: 'first', position: 'First role' },
      { ...testExperience[0], id: 'second', position: 'Second role' },
    ]
    const path = buildPath({ about: testAbout, experience, profile: testProfile })

    expect(path.map((node) => node.title)).toEqual(['BSc Test', 'First role', 'Second role', 'Graduate'])
  })
})
