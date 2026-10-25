import { Container } from '../components/ui/Container'
import { navItems, profile } from '../data/portfolio'

export function HomePage() {
  return (
    <>
      {navItems.map((item) => {
        const isHome = item.sectionId === 'home'
        const Heading = isHome ? 'h1' : 'h2'
        const headingId = `${item.sectionId}-heading`

        return (
          <section
            key={item.sectionId}
            id={item.sectionId}
            aria-labelledby={headingId}
            className="flex min-h-[70vh] items-center border-b border-line"
          >
            <Container>
              <Heading id={headingId} className="text-3xl font-semibold tracking-tight">
                {isHome ? profile.name : item.label}
              </Heading>
              <p className="mt-3 text-muted">
                {isHome ? profile.title : 'Placeholder section, built in Stage 5.'}
              </p>
            </Container>
          </section>
        )
      })}
    </>
  )
}