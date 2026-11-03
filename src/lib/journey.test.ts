import { describe, expect, it } from 'vitest'
import { WAYPOINTS, journeyAt } from './journey'

describe('journeyAt', () => {
  it('starts at the intro spot and ends invisible', () => {
    expect(journeyAt(0)).toMatchObject({ y: 0, scale: 1, opacity: 1 })
    expect(journeyAt(100).opacity).toBe(0)
  })

  it('clamps negative scroll (rubber-banding) to the start', () => {
    expect(journeyAt(-2)).toEqual(WAYPOINTS[0])
  })

  it('lands exactly on a waypoint', () => {
    expect(journeyAt(0.8)).toMatchObject({ y: -18, scale: 0.95, opacity: 0.8 })
  })

  it('moves smoothly: halfway between two waypoints is halfway in value', () => {
    const middle = journeyAt(1.15) // halfway between 0.8 and 1.5
    expect(middle.y).toBeCloseTo((-18 + -40) / 2)
    expect(middle.opacity).toBeCloseTo(0.4)
  })
})
