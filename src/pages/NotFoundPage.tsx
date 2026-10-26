import { Link } from 'react-router'
import { Container } from '../components/ui/Container'
import { site } from '../data/portfolio'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function NotFoundPage() {
  useDocumentMeta({
    title: `Page not found | ${site.brand}`,
    description: site.description,
    noindex: true,
  })

  return (
    <Container className="py-32">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 max-w-md text-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
      >
        Back to home
      </Link>
    </Container>
  )
}