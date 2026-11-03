/** Math for the pinned, scroll-driven horizontal Skills track. */

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** How far the track must slide so its last card ends at the right edge of the viewport box. */
export function pinnedTravel(trackWidth: number, boxWidth: number): number {
  return Math.max(0, Math.ceil(trackWidth - boxWidth))
}

/**
 * 0 before the section is pinned, 1 once the last card is revealed, and in between
 * exactly the share of the vertical scroll distance that has passed.
 */
export function pinnedProgress(scrollY: number, sectionTop: number, travel: number): number {
  if (travel <= 0) return 0
  return clamp((scrollY - sectionTop) / travel, 0, 1)
}
