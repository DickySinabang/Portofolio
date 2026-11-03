export type Waypoint = {
  at: number
  y: number
  scale: number
  opacity: number
}

export const WAYPOINTS: readonly Waypoint[] = [
  { at: 0, y: 0, scale: 1, opacity: 1 },
  { at: 0.8, y: -18, scale: 0.95, opacity: 0.8 },
  { at: 1.5, y: -40, scale: 0.9, opacity: 0 },
]

const ease = (t: number) => t * t * (3 - 2 * t)

/** Interpolates the waypoints, easing each leg so the planet drifts instead of lurching. */
export function journeyAt(viewports: number, points: readonly Waypoint[] = WAYPOINTS): Waypoint {
  if (viewports <= points[0].at) return points[0]
  const last = points[points.length - 1]
  if (viewports >= last.at) return last

  const index = points.findIndex((point) => point.at > viewports)
  const from = points[index - 1]
  const to = points[index]
  const t = ease((viewports - from.at) / (to.at - from.at))
  const mix = (a: number, b: number) => a + (b - a) * t
  return {
    at: viewports,
    y: mix(from.y, to.y),
    scale: mix(from.scale, to.scale),
    opacity: mix(from.opacity, to.opacity),
  }
}
