import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

// The particle animation draws on a <canvas>, which jsdom cannot do.
vi.mock('../components/sections/ParticleField', () => ({ ParticleField: () => null }))

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  it('does not show the terminal section on the main page', () => {
    const { container } = renderHome()

    expect(container.querySelector('#terminal')).toBeNull()
    expect(container).not.toHaveTextContent('Ask my portfolio')
  })

  it('never contains two elements with the same id', () => {
    const { container } = renderHome()

    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id)
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
    expect(duplicates).toEqual([])
  })

  it('has no leftover placeholder sections', () => {
    const { container } = renderHome()

    expect(container).not.toHaveTextContent('Placeholder section')
    expect(container.querySelectorAll('[id=contact]').length).toBeLessThanOrEqual(1)
  })
})
