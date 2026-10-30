import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { Navbar } from './Navbar'

// Use fixed navigation data so these tests never depend on your real content.
vi.mock('../../data/portfolio', () => ({
  site: { brand: 'TestBrand' },
  navItems: [
    { label: 'Home', sectionId: 'home' },
    { label: 'About', sectionId: 'about' },
    { label: 'Projects', sectionId: 'projects' },
  ],
}))

function renderNavbar(path = '/', onOpenPalette = vi.fn()) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar onOpenPalette={onOpenPalette} />
    </MemoryRouter>,
  )
  return { onOpenPalette }
}

function primaryNav() {
  return within(screen.getByRole('navigation', { name: 'Primary' }))
}

describe('Navbar', () => {
  it('renders the brand and a link for every navigation item', () => {
    renderNavbar()

    expect(screen.getByRole('link', { name: 'TestBrand' })).toHaveAttribute('href', '/')
    expect(primaryNav().getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(primaryNav().getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about')
    expect(primaryNav().getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '/#projects',
    )
  })

  it('marks Home as the current location on the home page', () => {
    renderNavbar('/')

    expect(primaryNav().getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    expect(primaryNav().getByRole('link', { name: 'Projects' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('marks Projects as current on a project detail page', () => {
    renderNavbar('/projects/some-project')

    expect(primaryNav().getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    expect(primaryNav().getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('opens and closes the mobile menu with its button', async () => {
    const user = userEvent.setup()
    renderNavbar()
    const menu = document.getElementById('mobile-menu')!

    expect(menu).toHaveAttribute('hidden')
    const openButton = screen.getByRole('button', { name: 'Open menu' })
    expect(openButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(openButton)
    expect(menu).not.toHaveAttribute('hidden')
    const closeButton = screen.getByRole('button', { name: 'Close menu' })
    expect(closeButton).toHaveAttribute('aria-expanded', 'true')

    await user.click(closeButton)
    expect(menu).toHaveAttribute('hidden')
  })

  it('closes the mobile menu when a link is chosen', async () => {
    const user = userEvent.setup()
    renderNavbar()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const mobileNav = within(screen.getByRole('navigation', { name: 'Mobile' }))
    await user.click(mobileNav.getByRole('link', { name: 'About' }))

    expect(document.getElementById('mobile-menu')).toHaveAttribute('hidden')
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })

  it('closes the mobile menu with Escape and returns focus to its button', async () => {
    const user = userEvent.setup()
    renderNavbar()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.keyboard('{Escape}')

    expect(document.getElementById('mobile-menu')).toHaveAttribute('hidden')
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  it('calls the handler when the search button is clicked', async () => {
    const user = userEvent.setup()
    const { onOpenPalette } = renderNavbar()

    await user.click(screen.getByRole('button', { name: 'Open command palette' }))
    expect(onOpenPalette).toHaveBeenCalledTimes(1)
  })
})