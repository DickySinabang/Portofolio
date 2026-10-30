import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * A live technical readout (pointer position and scroll progress). It writes
 * straight into the text nodes, so React never re-renders as you move or scroll.
 * Decorative only, and static for reduced-motion visitors.
 */
export function HeroTelemetry() {
  const reduced = useReducedMotion()
  const xRef = useRef<HTMLSpanElement>(null)
  const yRef = useRef<HTMLSpanElement>(null)
  const scrollRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced) return

    const pointer = { x: 0.5, y: 0.5 }
    let frame = 0

    const render = () => {
      frame = 0
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      const progress = max > 0 ? Math.round((root.scrollTop / max) * 100) : 0

      if (xRef.current) xRef.current.textContent = pointer.x.toFixed(2)
      if (yRef.current) yRef.current.textContent = pointer.y.toFixed(2)
      if (scrollRef.current) scrollRef.current.textContent = String(progress).padStart(3, '0')
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth
      pointer.y = event.clientY / window.innerHeight
      schedule()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', schedule)
    }
  }, [reduced])

  return (
    <p
      aria-hidden="true"
      className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase tabular-nums"
    >
      X <span ref={xRef}>0.50</span> · Y <span ref={yRef}>0.50</span> · SCROLL{' '}
      <span ref={scrollRef}>000</span>%
    </p>
  )
}
