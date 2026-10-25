import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'
import { hero, profile } from '../../data/portfolio'
import { getSocialLinks } from '../../lib/socialLinks'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { HeroCodeCard } from './HeroCodeCard'

export function HeroSection() {
  const availability = hero.availability?.trim()
  const cvUrl = profile.cvUrl?.trim()
  const socialLinks = getSocialLinks(profile)

  return (
    <section id="home" aria-labelledby="home-heading" className="border-b border-line">
      <Container className="grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
        <div>
          {availability && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted">
              <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
              {availability}
            </p>
          )}

          <p className="font-mono text-sm text-accent">{profile.name}</p>
          <h1
            id="home-heading"
            className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {hero.headline}
          </h1>
          <p className="mt-4 text-lg font-medium">{profile.title}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {hero.intro}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/#projects">
              View My Projects
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink to="/#contact" variant="secondary">
              Contact Me
            </ButtonLink>
            {cvUrl && (
              <ButtonLink href={cvUrl} download variant="secondary">
                <Download aria-hidden="true" className="size-4" />
                Download CV
              </ButtonLink>
            )}
          </div>

          {socialLinks.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                    {link.external && (
                      <>
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <HeroCodeCard />
      </Container>
    </section>
  )
}