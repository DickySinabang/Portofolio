import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from './Footer'

vi.mock('../../data/portfolio', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/portfolio')>()),
  profile: { name: 'Ada Lovelace', title: 'Test Developer' },
}))

describe('Footer', () => {
  it('shows only the copyright and a short identity', () => {
    render(<Footer />)

    expect(screen.getByText(`© ${new Date().getFullYear()} Ada Lovelace`)).toBeInTheDocument()
    expect(screen.getByText('Test Developer')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})