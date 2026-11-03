/** Orbit rings drawn around the Earth in the 3D scene, and the WebGL check. */

export type OrbitSpec = {
  /** Orbit radius, in Earth radii. */
  radius: number
  /** Tilt of the orbit plane toward the viewer, in radians. */
  tilt: number
  /** Rotation of the tilted orbit on the screen, in radians. */
  roll: number
  /** Ring opacity at full strength. */
  opacity: number
}

export const ORBITS: readonly OrbitSpec[] = [
  { radius: 1.55, tilt: 0.33, roll: -0.3, opacity: 0.45 },
  { radius: 1.85, tilt: 0.52, roll: 0.38, opacity: 0.28 },
]

/**
 * True when the browser has WebGL at all. The scene itself still handles a failed
 * context (blocked GPU, lost context) by falling back to the CSS planet.
 */
export function canUseWebGL(): boolean {
  return typeof window !== 'undefined' && 'WebGLRenderingContext' in window
}
