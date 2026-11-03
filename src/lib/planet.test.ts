import { describe, expect, it } from 'vitest'
import { ORBITS, canUseWebGL } from './planet'

describe('ORBITS', () => {
  it('circle outside the Earth, the inner ring first', () => {
    expect(ORBITS[0].radius).toBeGreaterThan(1)
    expect(ORBITS[1].radius).toBeGreaterThan(ORBITS[0].radius)
  })
})

describe('canUseWebGL', () => {
  it('is false where the browser has no WebGL (like jsdom)', () => {
    expect(canUseWebGL()).toBe(false)
  })
})
