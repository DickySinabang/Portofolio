import { Container } from './components/ui/Container'
import { ThemeToggle } from './components/ui/ThemeToggle'

function App() {
  return (
    <main className="min-h-screen">
      <Container className="py-12">
        <div className="flex items-center justify-between">
          <p className="font-mono text-sm text-muted">DevPortfolio</p>
          <ThemeToggle />
        </div>

        <h1 className="mt-16 text-4xl font-semibold tracking-tight sm:text-6xl">
          Design system check
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Muted text, a surface card, a border, and an accent color. Toggle the
          theme and reload the page to confirm your choice is remembered.
        </p>

        <div className="mt-10 max-w-md rounded-lg border border-line bg-surface p-6">
          <p className="font-medium">Surface card</p>
          <p className="mt-1 text-sm text-muted">Subtle border, restrained radius.</p>
          <button
            type="button"
            className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
          >
            Accent button
          </button>
        </div>
      </Container>
    </main>
  )
}

export default App