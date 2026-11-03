import { profile } from '../../data/portfolio'
import { Container } from '../ui/Container'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        <p className="font-mono text-xs tracking-[0.14em] uppercase">{profile.title}</p>
      </Container>
    </footer>
  )
}