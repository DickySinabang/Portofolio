import { useLayoutEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { CommandPalette } from '../ui/CommandPalette'
import { ScrollProgress } from '../ui/ScrollProgress'
import { Cosmos } from './Cosmos'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { ScrollToHash } from './ScrollToHash'
import { SectionRail } from './SectionRail'

export function Layout() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  useLayoutEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Cosmos />
      <ScrollToHash />
      <ScrollProgress />
      <SectionRail />
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}