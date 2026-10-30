import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { site } from './data/portfolio'

// The particle animation draws on a <canvas>, which jsdom cannot do.
vi.mock('./components/sections/ParticleField', () => ({ ParticleField: () => null }))

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  it('shows the 404 page for an unknown URL, inside the normal layout', () => {
    renderApp('/definitely-not-a-page')

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('banner')).toBeInTheDocument() // the navbar is still there
    expect(document.title).toBe(`Page not found | ${site.brand}`)
  })

  it('shows "project not found" for an unknown project URL', () => {
    renderApp('/projects/does-not-exist')

    expect(screen.getByRole('heading', { level: 1, name: 'Project not found' })).toBeInTheDocument()
  })

  it('renders the home page with a single h1 and a main landmark', () => {
    renderApp('/')

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})