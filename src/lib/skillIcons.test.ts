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

  it('knows every technology in the skill cards', () => {
    const names = [
      'Tailwind', 'Go', 'Dart', 'Arduino IDE', 'C++', 'TensorFlow', 'Google Colab',
      'Vite', 'Three.js', 'React Router',
    ]
    for (const name of names) {
      expect(getSkillVisual(name).brandPath, name).toBeTruthy()
      expect(getSkillVisual(name).brandColor, name).toMatch(/^#[0-9A-F]{6}$/i)
    }
    expect(getSkillVisual('Tailwind').label).toBe('Tailwind CSS')
  })

  it('gives concepts a short label, a generic icon, and their own colour', () => {
    const rest = getSkillVisual('REST API development')

    expect(rest).toMatchObject({ label: 'REST API', fallback: 'api', brandColor: '#0EA5E9' })
    expect(rest.brandPath).toBeUndefined()
    expect(getSkillVisual('IoT Sensors')).toMatchObject({ label: 'IoT Sensors', fallback: 'iot' })
    expect(getSkillVisual('LSTM')).toMatchObject({ label: 'LSTM', fallback: 'ml' })
  })

  it('swaps a very dark brand colour for a visible glow', () => {
    expect(getSkillVisual('GitHub').brandColor).toBe('#8B9CFF')
    expect(getSkillVisual('Three.js').brandColor).toBe('#8B9CFF')
    expect(getSkillVisual('React').brandColor).toBe('#61DAFB')
  })

  it('still shows a skill it does not know, under its own name', () => {
    expect(getSkillVisual('Rust')).toEqual({ label: 'Rust', fallback: 'generic' })
  })
})