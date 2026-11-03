export type Pose = {
  /** Camera distance from the Earth's center. */
  distance: number
  /** Camera angle around the Earth (radians). */
  azimuth: number
  /** Camera height above the equator (radians). */
  elevation: number
  /** Where the Earth sits on screen: -1 (left/bottom) to 1 (right/top). */
  anchorX: number
  anchorY: number
  /** Earth rotation driven by scroll (radians), on top of its slow constant spin. */
  spin: number
  /** Earth size multiplier. */
  scale: number
  /** Atmosphere glow strength. */
  glow: number
  /** Sunlight direction in camera space (x right, y up, z toward the viewer). */
  sunX: number
  sunY: number
  sunZ: number
  /** Orbit rings, and orbital dust, visibility (0 to 1). */
  rings: number
  dust: number
  /** A slight tilt of the camera (radians). */
  roll: number
}

export const FOV_DEGREES = 35
export const HERO_RADIUS_OF_WIDTH = 0.66
export const HERO_TOP_OF_HEIGHT = 0.15

/** On tall, narrow screens the Earth is a larger share of the width and sits lower. */
function heroShape(aspect: number) {
  return aspect >= 1
    ? { radiusOfWidth: HERO_RADIUS_OF_WIDTH, top: HERO_TOP_OF_HEIGHT }
    : { radiusOfWidth: 0.9, top: 0.64 }
}

/** Camera distance that gives the intro Earth its radius on a screen with this width/height. */
export function heroDistance(aspect: number): number {
  const ratio = heroShape(aspect).radiusOfWidth * 2 * aspect // radius in half-heights
  const angularRadius = Math.atan(ratio * Math.tan((FOV_DEGREES / 2) * (Math.PI / 180)))
  return 1 / Math.sin(angularRadius)
}

/** Vertical anchor (-1 bottom, 1 top) that puts the intro Earth's top edge where the composition wants it. */
export function heroAnchorY(aspect: number): number {
  const { radiusOfWidth, top } = heroShape(aspect)
  return 1 - 2 * (top + radiusOfWidth * aspect)
}

export const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'projects', 'contact'] as const

/** One pose per section: huge in the intro, a complete, distant Earth at Contact. */
export const POSES: readonly Pose[] = [
  { distance: 1.8, azimuth: 0.0, elevation: -0.42, anchorX: 0.06, anchorY: -1.41, spin: 0.0, scale: 1.0, glow: 1.0, sunX: 0.92, sunY: 0.36, sunZ: 0.12, rings: 0.3, dust: 0.45, roll: 0 },
  // About: the camera starts to pull away and swing around.
  { distance: 5.2, azimuth: 0.45, elevation: 0.3, anchorX: 0.62, anchorY: 0.05, spin: 1.1, scale: 1.0, glow: 1.05, sunX: 0.75, sunY: 0.4, sunZ: 0.5, rings: 0.85, dust: 0.9, roll: 0.03 },
  // Skills: a smaller Earth above the cards.
  { distance: 8.0, azimuth: 0.85, elevation: 0.22, anchorX: 0.74, anchorY: 0.45, spin: 2.2, scale: 0.97, glow: 1.1, sunX: 0.5, sunY: 0.4, sunZ: 0.77, rings: 0.6, dust: 0.7, roll: -0.03 },
  // Experience
  { distance: 10.0, azimuth: 1.2, elevation: 0.12, anchorX: 0.7, anchorY: 0.3, spin: 3.3, scale: 0.94, glow: 1.1, sunX: 0.48, sunY: 0.36, sunZ: 0.8, rings: 0.4, dust: 0.55, roll: 0.04 },
  // Projects
  { distance: 13.0, azimuth: 1.55, elevation: 0.2, anchorX: 0.72, anchorY: 0.35, spin: 4.4, scale: 0.9, glow: 1.15, sunX: 0.45, sunY: 0.34, sunZ: 0.82, rings: 0.25, dust: 0.4, roll: -0.02 },
  // Contact: far away, the whole planet in view above the message panel, calmly lit.
  { distance: 19.0, azimuth: 1.9, elevation: 0.26, anchorX: 0.55, anchorY: 0.5, spin: 5.5, scale: 0.88, glow: 1.2, sunX: 0.4, sunY: 0.3, sunZ: 0.87, rings: 0.15, dust: 0.3, roll: 0.01 },
]

const FIELDS = Object.keys(POSES[0]) as (keyof Pose)[]

/** Catmull-Rom spline through p1 and p2 (p0 and p3 shape the tangents). t is 0 to 1. */
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t
  const t3 = t2 * t
  return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t3)
}

/** The camera pose at journey position `s` (0 to POSES.length - 1; values outside are clamped). */
export function samplePose(s: number, poses: readonly Pose[] = POSES): Pose {
  const last = poses.length - 1
  const clamped = Math.min(Math.max(s, 0), last)
  const index = Math.min(Math.floor(clamped), last - 1)
  const t = clamped - index
  const at = (i: number) => poses[Math.min(Math.max(i, 0), last)]

  const result = {} as Pose
  for (const field of FIELDS) {
    result[field] = catmullRom(at(index - 1)[field], at(index)[field], at(index + 1)[field], at(index + 2)[field], t)
  }
  return result
}

/** Keeps the Earth on screen and sensibly sized in tall, narrow windows (phones). */
export function adaptPose(pose: Pose, aspect: number): Pose {
  if (aspect >= 1) return pose
  const narrow = 1 - aspect
  return {
    ...pose,
    distance: pose.distance * Math.min(1 + narrow * 1.6, 2.1),
    // Toward the right edge, away from the text column.
    anchorX: Math.min(pose.anchorX + narrow * 0.3, 0.72),
    anchorY: pose.anchorY - 0.3 * narrow,
  }
}

export function sectionProgress(scrollY: number, tops: readonly number[]): number {
  if (tops.length < 2) return 0
  if (scrollY <= tops[0]) return 0
  const last = tops.length - 1
  if (scrollY >= tops[last]) return last

  let index = 0
  while (index < last - 1 && scrollY >= tops[index + 1]) index++
  return index + (scrollY - tops[index]) / (tops[index + 1] - tops[index])
}

export function remapProgress(position: number, indexes: readonly number[]): number {
  if (indexes.length === 0) return 0
  if (position <= 0) return indexes[0]
  const last = indexes.length - 1
  if (position >= last) return indexes[last]
  const index = Math.floor(position)
  const t = position - index
  return indexes[index] + (indexes[index + 1] - indexes[index]) * t
}

/** Makes section offsets usable: clamped to what can be scrolled, strictly increasing. */
export function normalizeTops(tops: number[], maxScroll: number): number[] {
  const clamped = tops.map((top) => Math.min(Math.max(top, 0), Math.max(maxScroll, 0)))
  for (let i = 1; i < clamped.length; i++) {
    clamped[i] = Math.max(clamped[i], clamped[i - 1] + 1)
  }
  return clamped
}

/** Frame-rate independent smoothing toward a target: the same feel at 30 or 144 fps. */
export function damp(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * dt))
}
