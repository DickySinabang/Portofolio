import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { navItems, site } from '../../data/portfolio'
import { useActiveSection } from '../../hooks/useActiveSection'
import { getSectionPath } from '../../lib/navigation'
import { Container } from '../ui/Container'
import { ThemeToggle } from '../ui/ThemeToggle'

const sectionIds = navItems.map((item) => item.sectionId)

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  const isHome = pathname === '/'
  const observedSection = useActiveSection(sectionIds, isHome)

  let activeId: string | null = null
  if (isHome) activeId = observedSection ?? 'home'
  else if (pathname.startsWith('/projects/')) activeId = 'projects'

  // Close the mobile menu with Escape and return focus to its button.
  useEffect(() => {
    if (!menuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="font-mono text-sm font-semibold tracking-tight">
          {site.brand}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = item.sectionId === activeId
            return (
              <Link
                key={item.sectionId}
                to={getSectionPath(item.sectionId)}
                aria-current={active ? 'location' : undefined}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'text-foreground underline decoration-accent decoration-2 underline-offset-8'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-surface md:hidden"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </Container>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!menuOpen}
        className="border-t border-line md:hidden"
      >
        <Container className="flex flex-col py-3">
          {navItems.map((item) => {
            const active = item.sectionId === activeId
            return (
              <Link
                key={item.sectionId}
                to={getSectionPath(item.sectionId)}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? 'location' : undefined}
                className={`rounded-lg px-3 py-3 text-base transition-colors ${
                  active
                    ? 'bg-surface font-medium text-foreground underline decoration-accent decoration-2 underline-offset-4'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </Container>
      </nav>
    </header>
  )
}