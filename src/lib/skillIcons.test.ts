import { describe, expect, it } from 'vitest'
import { getSkillVisual } from './skillIcons'

describe('getSkillVisual', () => {
  it('gives known technologies a brand logo and a clean label', () => {
    const react = getSkillVisual('React')

    expect(react.label).toBe('React')
    expect(react.brandPath).toBeTruthy()
  })

  it('ignores case and surrounding spaces', () => {
    expect(getSkillVisual('  typescript ').label).toBe('TypeScript')
  })

  it('gives concepts a short label and a generic icon', () => {
    const rest = getSkillVisual('REST API development')

    expect(rest).toMatchObject({ label: 'REST API', fallback: 'api' })
    expect(rest.brandPath).toBeUndefined()
    expect(getSkillVisual('IoT sensor integration')).toMatchObject({ label: 'IoT Sensors', fallback: 'iot' })
    expect(getSkillVisual('Machine learning (basics)')).toMatchObject({
      label: 'Machine Learning',
      fallback: 'ml',
    })
  })

  it('still shows a skill it does not know, under its own name', () => {
    expect(getSkillVisual('Go')).toEqual({ label: 'Go', fallback: 'generic' })
  })
})