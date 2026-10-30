import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  document.documentElement.classList.add('dark')
  localStorage.clear()
})

describe('ThemeToggle', () => {
  it('switches theme, updates its label, and remembers the choice', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('light')

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('keeps several toggles in sync', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ThemeToggle />
        <ThemeToggle />
      </>,
    )

    await user.click(screen.getAllByRole('button')[0])
    expect(screen.getAllByRole('button', { name: 'Switch to dark theme' })).toHaveLength(2)
  })
})