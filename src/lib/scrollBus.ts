/**
 * One shared, passive scroll listener for everything that reacts to scrolling
 * (the Earth scene, the Skills track, the star field, the CSS fallback planet).
 * Callbacks run at most once per animation frame, and nothing here touches React
 * state, so scrolling never causes re-renders.
 */
type ScrollListener = (scrollY: number) => void

const listeners = new Set<ScrollListener>()
let frame = 0
let attached = false

function flush() {
  frame = 0
  const y = window.scrollY
  listeners.forEach((listener) => listener(y))
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush)
}

/** Subscribes to scroll and resize. Calls back once immediately. Returns the unsubscribe function. */
export function subscribeScroll(listener: ScrollListener): () => void {
  listeners.add(listener)
  if (!attached) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    attached = true
  }
  listener(window.scrollY)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && attached) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
      frame = 0
      attached = false
    }
  }
}
