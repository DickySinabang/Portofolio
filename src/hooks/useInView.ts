import { useEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

type InViewOptions = {
  threshold?: number
  rootMargin?: string
}

/**
 * Reports whether an element has scrolled into view. Once it has, it stays true,
 * so entrance animations play a single time. With reduced motion it is true
 * straight away, so nothing is ever left hidden.
 */
export function useInView<T extends Element>({
  threshold = 0.1,
  rootMargin = '0px 0px -8% 0px',
}: InViewOptions = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || reduced) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [reduced, threshold, rootMargin])

  return [ref, reduced || seen]
}
