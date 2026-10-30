import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ButtonLink } from './ButtonLink'

describe('ButtonLink', () => {
  it('renders an internal link for "to"', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/#projects">Go</ButtonLink>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/#projects')
  })

  it('opens external links safely and announces it with a readable name', () => {
    render(
      <ButtonLink href="https://example.com" external>
        Docs
      </ButtonLink>,
    )

    const link = screen.getByRole('link', { name: 'Docs, opens in a new tab' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not open a new tab for ordinary links', () => {
    render(<ButtonLink href="mailto:me@example.com">Email</ButtonLink>)

    expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target')
  })

  it('marks file links as downloads', () => {
    render(
      <ButtonLink href="/cv/me.pdf" download>
        CV
      </ButtonLink>,
    )

    expect(screen.getByRole('link', { name: 'CV' })).toHaveAttribute('download')
  })

  it('renders nothing when it has no destination', () => {
    const { container } = render(<ButtonLink>Nowhere</ButtonLink>)

    expect(container).toBeEmptyDOMElement()
  })
})