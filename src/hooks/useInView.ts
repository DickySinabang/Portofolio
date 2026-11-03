import { useEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

type InViewOptions = {
  threshold?: number
  rootMargin?: string
}

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
