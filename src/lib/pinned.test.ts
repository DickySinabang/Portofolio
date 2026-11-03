import { describe, expect, it } from 'vitest'
import { pinnedProgress, pinnedTravel } from './pinned'

describe('pinnedTravel', () => {
  it('is the overflow of the track, never negative', () => {
    expect(pinnedTravel(2400, 1200)).toBe(1200)
    expect(pinnedTravel(900.2, 1200)).toBe(0)
  })
})

describe('pinnedProgress', () => {
  it('is 0 before the pin and 1 after the last card', () => {
    expect(pinnedProgress(500, 1000, 800)).toBe(0)
    expect(pinnedProgress(5000, 1000, 800)).toBe(1)
  })

  it('follows the vertical scroll distance exactly in between, in both directions', () => {
    expect(pinnedProgress(1400, 1000, 800)).toBeCloseTo(0.5)
    expect(pinnedProgress(1200, 1000, 800)).toBeCloseTo(0.25)
  })

  it('is 0 when there is nothing to travel', () => {
    expect(pinnedProgress(1400, 1000, 0)).toBe(0)
  })
})
