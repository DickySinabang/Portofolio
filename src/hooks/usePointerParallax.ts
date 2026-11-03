import { useEffect, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function usePointerParallax(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frame = 0

    const tick = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      element.style.setProperty('--px', current.x.toFixed(3))
      element.style.setProperty('--py', current.y.toFixed(3))

      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001
      frame = settled ? 0 : requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1
      target.y = (event.clientY / window.innerHeight) * 2 - 1
      if (!frame) frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(frame)
    }
  }, [ref, reduced])
}