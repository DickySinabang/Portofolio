import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { canUseWebGL } from '../../lib/planet'
import { PlanetJourney } from './PlanetJourney'

// Three.js lives in its own chunk, fetched only after the page is interactive.
const EarthScene = lazy(() => import('../sections/EarthScene'))

export function EarthJourney() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const reduced = useReducedMotion()
  const [idle, setIdle] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const wantsWebGL = onHome && canUseWebGL() && !reduced && !failed

  // Wait for an idle moment, so the scene never competes with the first paint.
  useEffect(() => {
    if (!wantsWebGL) return
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(() => setIdle(true), { timeout: 1500 })
      return () => window.cancelIdleCallback(handle)
    }
    const handle = window.setTimeout(() => setIdle(true), 300)
    return () => window.clearTimeout(handle)
  }, [wantsWebGL])

  if (!onHome) return null

  const mode = wantsWebGL && idle && ready ? 'webgl' : 'css'

  return (
    <div data-planet={mode} className="absolute inset-0">
      {/* The photo is only requested when the 3D scene is not going to be used. */}
      <PlanetJourney photo={!wantsWebGL} />

      {wantsWebGL && idle && (
        <Suspense fallback={null}>
          <EarthScene onReady={() => setReady(true)} onFail={() => setFailed(true)} />
        </Suspense>
      )}
    </div>
  )
}
