import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'

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

  it('has no numbered label above the title', () => {
    render(
      <Section id="projects" eyebrow="Projects" title="Selected projects">
        <p>Body</p>
      </Section>,
    )

    expect(screen.queryByText(/^0\d$/)).not.toBeInTheDocument()
    expect(screen.queryByText('Projects')).not.toBeInTheDocument()
  })
})