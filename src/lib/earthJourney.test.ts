import { describe, expect, it } from 'vitest'
import { POSES, adaptPose, damp, heroAnchorY, heroDistance, normalizeTops, remapProgress, samplePose, sectionProgress } from './earthJourney'

describe('samplePose', () => {
  it('hits every keyframe exactly', () => {
    POSES.forEach((pose, index) => {
      expect(samplePose(index).distance).toBeCloseTo(pose.distance)
      expect(samplePose(index).azimuth).toBeCloseTo(pose.azimuth)
    })
  })

  it('retreats steadily: the camera never gets closer as you scroll down', () => {
    let previous = samplePose(0).distance
    for (let s = 0.05; s <= 5; s += 0.05) {
      const { distance } = samplePose(s)
      expect(distance).toBeGreaterThanOrEqual(previous - 1e-9)
      previous = distance
    }
  })

  it('moves smoothly: no jump between neighbouring positions', () => {
    for (let s = 0; s < 5; s += 0.01) {
      const a = samplePose(s)
      const b = samplePose(s + 0.01)
      expect(Math.abs(b.distance - a.distance)).toBeLessThan(0.1)
      expect(Math.abs(b.anchorX - a.anchorX)).toBeLessThan(0.05)
    }
  })

  it('clamps outside the journey', () => {
    expect(samplePose(-3)).toEqual(samplePose(0))
    expect(samplePose(99)).toEqual(samplePose(5))
  })

  it('ends with a small, distant Earth, fully inside the frame', () => {
    const end = samplePose(5)
    expect(end.distance).toBeGreaterThan(samplePose(0).distance * 4)
    // Radius as a share of the viewport height: about 1 / (distance * tan(fov / 2)) / 2.
    const radiusShare = (end.scale / (end.distance * Math.tan((35 / 2) * (Math.PI / 180)))) / 2
    expect(radiusShare).toBeLessThan(0.12)
    expect(Math.abs(end.anchorX) + radiusShare * 2).toBeLessThan(1.2)
  })
})

describe('adaptPose', () => {
  it('leaves landscape poses alone and pulls the camera back on phones', () => {
    const pose = samplePose(0)
    expect(adaptPose(pose, 1.6)).toBe(pose)
    expect(adaptPose(pose, 0.46).distance).toBeGreaterThan(pose.distance)
    // ...and moves it toward the right edge, away from the text, but never off screen.
    expect(adaptPose(pose, 0.46).anchorX).toBeGreaterThan(pose.anchorX)
    expect(adaptPose(pose, 0.2).anchorX).toBeLessThanOrEqual(0.72)
  })
})

describe('sectionProgress', () => {
  const tops = [0, 1000, 2000, 4000]

  it('maps scroll positions to section positions', () => {
    expect(sectionProgress(-50, tops)).toBe(0)
    expect(sectionProgress(500, tops)).toBeCloseTo(0.5)
    expect(sectionProgress(1000, tops)).toBeCloseTo(1)
    expect(sectionProgress(3000, tops)).toBeCloseTo(2.5)
    expect(sectionProgress(9000, tops)).toBe(3)
  })

  it('is reversible: the same scroll position always gives the same value', () => {
    expect(sectionProgress(1500, tops)).toBe(sectionProgress(1500, tops))
  })
})

describe('normalizeTops', () => {
  it('clamps to the scrollable range and keeps the order strictly increasing', () => {
    expect(normalizeTops([0, 1000, 5000, 6000], 3000)).toEqual([0, 1000, 3000, 3001])
  })
})

describe('damp', () => {
  it('approaches the target without overshooting, at any frame length', () => {
    const slow = damp(0, 10, 6, 1 / 30)
    const fast = damp(0, 10, 6, 1 / 144)
    expect(slow).toBeGreaterThan(fast)
    expect(slow).toBeLessThan(10)
    expect(damp(10, 10, 6, 1 / 60)).toBe(10)
  })
})

describe('remapProgress', () => {
  it('is the identity when every section exists', () => {
    expect(remapProgress(2.5, [0, 1, 2, 3])).toBeCloseTo(2.5)
  })

  it('skips over the keyframe of a missing section', () => {
    // Sections 0, 1, 3 and 4 exist (section 2 is missing).
    expect(remapProgress(1, [0, 1, 3, 4])).toBe(1)
    expect(remapProgress(1.5, [0, 1, 3, 4])).toBeCloseTo(2)
    expect(remapProgress(2, [0, 1, 3, 4])).toBe(3)
    expect(remapProgress(9, [0, 1, 3, 4])).toBe(4)
  })
})

describe('intro composition', () => {
  it('puts the camera close for a wide screen, and keeps the planet at about two thirds of the width', () => {
    const aspect = 1.6
    const angular = Math.asin(1 / heroDistance(aspect))
    const radiusInHalfHeights = Math.tan(angular) / Math.tan((35 / 2) * (Math.PI / 180))
    expect(radiusInHalfHeights / (2 * aspect)).toBeCloseTo(0.66, 2)
  })

  it('matches the design values of the first keyframe on a 16:10 screen', () => {
    expect(heroDistance(1.6)).toBeCloseTo(POSES[0].distance, 1)
    expect(heroAnchorY(1.6)).toBeCloseTo(POSES[0].anchorY, 1)
  })

  it('has its own shape for portrait screens, and the top edge stays on screen', () => {
    expect(heroDistance(0.46)).toBeGreaterThan(heroDistance(1.6))
    expect(heroAnchorY(0.46)).toBeGreaterThan(-1.3)
  })
})
