import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, Search, X } from 'lucide-react'
import { navItems, site } from '../../data/portfolio'
import { useActiveSection } from '../../hooks/useActiveSection'
import { getSectionPath } from '../../lib/navigation'
import { Container } from '../ui/Container'
import { ThemeToggle } from '../ui/ThemeToggle'

const sectionIds = navItems.map((item) => item.sectionId)
const pad = (index: number) => String(index + 1).padStart(2, '0')

type NavbarProps = {
  onOpenPalette: () => void
}

export function Navbar({ onOpenPalette }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const { pathname } = useLocation()

  const isHome = pathname === '/'
  const observedSection = useActiveSection(sectionIds, isHome)

  let activeId: string | null = null
  if (isHome) activeId = observedSection ?? 'home'
  else if (pathname.startsWith('/projects/')) activeId = 'projects'

  // Slide the highlight pill under the active link. This writes straight to the
  // element's style (no React state), so it never causes extra renders.
  useLayoutEffect(() => {
    const nav = navRef.current
    const indicator = indicatorRef.current
    if (!nav || !indicator) return

    const place = () => {
      const target = activeId
        ? nav.querySelector<HTMLElement>(`[data-nav-id="${activeId}"]`)
        : null
      if (!target) {
        indicator.style.opacity = '0'
        return
      }
      indicator.style.opacity = '1'
      indicator.style.width = `${target.offsetWidth}px`
      indicator.style.transform = `translateX(${target.offsetLeft}px)`
    }

    place()
    window.addEventListener('resize', place)
    // Link widths change once the web fonts finish loading.
    void document.fonts?.ready.then(place)
    return () => window.removeEventListener('resize', place)
  }, [activeId])

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

  // While the full-screen menu is open, the page behind it should not scroll.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previous
    }
  }, [menuOpen])

  // If the window grows past the mobile breakpoint, close the menu.
  useEffect(() => {
    if (!menuOpen) return
    const query = window.matchMedia('(min-width: 768px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 pt-3">
      <Container size="wide">
        <div className="relative z-10 flex h-14 items-center justify-between gap-3 rounded-full border border-line bg-background/70 py-2 pr-2 pl-5 backdrop-blur-xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 64 64"
              className="size-5 shrink-0"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M26 22 14 32l12 10" stroke="var(--accent)" />
              <path d="M38 22l12 10-12 10" stroke="var(--accent-2)" />
            </svg>
            {site.brand}
          </Link>

          <nav
            ref={navRef}
            aria-label="Primary"
            className="relative hidden items-center gap-0.5 md:flex"
          >
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-0 h-9 -translate-y-1/2 rounded-full border border-accent/30 bg-accent/10 opacity-0 transition-[transform,width,opacity] duration-300 ease-out"
            />
            {navItems.map((item, index) => {
              const active = item.sectionId === activeId
              return (
                <Link
                  key={item.sectionId}
                  to={getSectionPath(item.sectionId)}
                  data-nav-id={item.sectionId}
                  aria-current={active ? 'location' : undefined}
                  className={`relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm whitespace-nowrap transition-colors lg:px-3.5 ${
                    active ? 'font-medium text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="hidden font-mono text-[10px] text-accent xl:inline"
                  >
                    {pad(index)}
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              aria-keyshortcuts="Control+K"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface/70 px-3 text-sm text-muted transition duration-200 hover:border-accent hover:text-foreground active:scale-95"
            >
              <Search aria-hidden="true" className="size-4" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden rounded border border-line px-1.5 font-mono text-xs xl:inline">
                Ctrl K
              </kbd>
            </button>
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-surface/70 transition duration-200 active:scale-95 md:hidden"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-4" />
              ) : (
                <Menu aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* A sibling of the bar (not inside it) so the bar's blur doesn't trap this fixed layer. */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!menuOpen}
        className="animate-fade-up fixed inset-0 overflow-y-auto bg-background/95 backdrop-blur-xl md:hidden"
      >
        <div className="flex flex-col px-6 pt-28 pb-16">
          {navItems.map((item, index) => {
            const active = item.sectionId === activeId
            return (
              <Link
                key={item.sectionId}
                to={getSectionPath(item.sectionId)}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? 'location' : undefined}
                className={`flex items-baseline gap-4 border-b border-line py-5 font-display text-4xl tracking-tight transition-colors ${
                  active ? 'text-foreground' : 'text-muted hover:text-foreground'
                }`}
              >
                <span aria-hidden="true" className="font-mono text-xs text-accent">
                  {pad(index)}
                </span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
