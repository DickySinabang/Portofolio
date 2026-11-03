import { useEffect, useRef } from 'react'
import { journeyAt } from '../../lib/journey'
import { subscribeScroll } from '../../lib/scrollBus'
import { HeroPlanet } from '../sections/HeroPlanet'

export function PlanetJourney({ photo }: { photo: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    return subscribeScroll((scrollY) => {
      const point = journeyAt(scrollY / window.innerHeight)
      element.style.setProperty('--ty', `${point.y.toFixed(2)}vh`)
      element.style.setProperty('--s', point.scale.toFixed(3))
      element.style.setProperty('--o', point.opacity.toFixed(3))
      // Fully faded: take it out of layout.
      element.style.display = point.opacity < 0.02 ? 'none' : ''
    })
  }, [])

  return (
    <div
      ref={ref}
      className="planet-fallback absolute inset-0 [opacity:var(--o,1)] [transform:translate3d(0,var(--ty,0),0)_scale(var(--s,1))]"
    >
      <HeroPlanet photo={photo} />
    </div>
  )
}
