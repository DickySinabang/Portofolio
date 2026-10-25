import { Outlet } from 'react-router'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { ScrollToHash } from './ScrollToHash'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToHash />
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}