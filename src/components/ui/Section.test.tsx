import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Section } from './Section'

// Fixed navigation, so the section numbers below never depend on your real content.
vi.mock('../../data/portfolio', () => ({
  navItems: [
    { label: 'Home', sectionId: 'home' },
    { label: 'About', sectionId: 'about' },
    { label: 'Projects', sectionId: 'projects' },
  ],
}))

describe('Section', () => {
  it('labels the section by its heading and renders its content', () => {
    render(
      <Section id="about" eyebrow="About" title="A little about me">
        <p>Section body</p>
      </Section>,
    )

    const section = screen.getByRole('region', { name: 'A little about me' })
    expect(section).toHaveAttribute('id', 'about')
    expect(screen.getByRole('heading', { level: 2, name: 'A little about me' })).toBeInTheDocument()
    expect(screen.getByText('Section body')).toBeInTheDocument()
  })

  it('shows the same number as the navbar for sections in the navigation', () => {
    render(
      <Section id="projects" eyebrow="Projects" title="Selected projects">
        <p>Body</p>
      </Section>,
    )

    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('shows only the label for a section that is not in the navigation', () => {
    render(
      <Section id="highlights" eyebrow="Highlights" title="Learning highlights">
        <p>Body</p>
      </Section>,
    )

    expect(screen.getByText('Highlights')).toBeInTheDocument()
    expect(screen.queryByText(/^0\d$/)).not.toBeInTheDocument()
  })
})
