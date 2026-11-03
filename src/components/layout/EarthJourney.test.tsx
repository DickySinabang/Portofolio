import { cleanup, render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EarthJourney } from './EarthJourney'

const data = vi.hoisted(() => ({ failScene: vi.fn() }))

// Stands in for the real Three.js scene, which needs a GPU: it reports a failure.
vi.mock('../sections/EarthScene', async () => {
  const { useEffect } = await import('react')
  function SceneStub({ onFail }: { onFail: () => void }) {
    useEffect(() => {
      data.failScene()
      onFail()
    }, [onFail])
    return null
  }
  return { default: SceneStub }
})

afterEach(() => {
  cleanup() // unmount first, while the stubbed idle-callback globals still exist
  vi.unstubAllGlobals()
  data.failScene.mockClear()
})

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <EarthJourney />
    </MemoryRouter>,
  )
}

describe('EarthJourney', () => {
  it('shows the CSS Earth and the skills when WebGL is unavailable', () => {
    // jsdom has no WebGLRenderingContext, exactly like a browser without WebGL.
    const { container } = renderAt('/')

    expect(container.querySelector('[data-planet="css"]')).not.toBeNull()
    expect(container.querySelector('.planet-css')).not.toBeNull()
    // No 3D scene is coming, so the NASA picture is used for the CSS planet.
    expect(container.querySelector('.planet-photo')).not.toBeNull()
    expect(data.failScene).not.toHaveBeenCalled()
  })

  it('stays out of the way on other pages', () => {
    const { container } = renderAt('/projects/some-project')

    expect(container).toBeEmptyDOMElement()
  })

  it('keeps the CSS Earth when the 3D scene fails to start', async () => {
    vi.stubGlobal('WebGLRenderingContext', class {})
    vi.stubGlobal('requestIdleCallback', (callback: () => void) => {
      callback()
      return 1
    })
    vi.stubGlobal('cancelIdleCallback', () => {})

    const { container } = renderAt('/')

    await waitFor(() => expect(data.failScene).toHaveBeenCalled(), { timeout: 5000 })
    expect(container.querySelector('[data-planet="css"]')).not.toBeNull()
    // The picture is only fetched once the 3D scene has really failed.
    await waitFor(() => expect(container.querySelector('.planet-photo')).not.toBeNull())
  })
})
