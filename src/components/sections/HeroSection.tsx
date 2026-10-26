import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'
import { about, hero, profile } from '../../data/portfolio'
import { getSocialLinks, hasContactDetails } from '../../lib/socialLinks'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { RotatingText } from '../ui/RotatingText'
import { Tilt } from '../ui/Tilt'
import { HeroCodeCard } from './HeroCodeCard'
import { ParticleField } from './ParticleField'

/** Staggers the entrance animation of each hero element. */
const stagger = (ms: number) => ({ animationDelay: `${ms}ms` })

export function HeroSection() {
  const availability = hero.availability?.trim()
  const cvUrl = profile.cvUrl?.trim()
  const socialLinks = getSocialLinks(profile)
  const showContact = hasContactDetails(profile)

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden border-b border-line"
    >
      {/* Decorative background: grid, two soft glows, and the interactive particles. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="animate-float absolute -left-24 top-10 size-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="animate-float absolute -right-24 bottom-0 size-96 rounded-full bg-accent-2/20 blur-3xl [animation-delay:-7s]" />
        <ParticleField className="absolute inset-0 size-full" />
      </div>

      <Container className="grid min-h-[calc(100svh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {availability && (
            <p
              className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted"
              style={stagger(0)}
            >
              <span aria-hidden="true" className="size-2 rounded-full bg-accent-2" />
              {availability}
            </p>
          )}

          <p
            className="animate-fade-up font-mono text-sm text-accent"
            style={stagger(60)}
          >
            {profile.name}
          </p>

          <h1
            id="home-heading"
            className="animate-fade-up text-gradient mt-4 pb-1 text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            style={stagger(120)}
          >
            {hero.headline}
          </h1>

          <p className="animate-fade-up mt-4 text-lg font-medium" style={stagger(200)}>
            {profile.title}
          </p>
          <p
            className="animate-fade-up mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            style={stagger(280)}
          >
            {hero.intro}
          </p>

          <div className="animate-fade-up mt-6" style={stagger(360)}>
            <RotatingText prefix="Currently interested in" words={about.interests} />
          </div>

          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-3"
            style={stagger(440)}
          >
            <ButtonLink to="/#projects">
              View My Projects
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            {showContact && (
              <ButtonLink to="/#contact" variant="secondary">
                Contact Me
              </ButtonLink>
            )}
            {cvUrl && (
              <ButtonLink href={cvUrl} download variant="secondary">
                <Download aria-hidden="true" className="size-4" />
                Download CV
              </ButtonLink>
            )}
          </div>

          {socialLinks.length > 0 && (
            <ul
              className="animate-fade-up mt-8 flex flex-wrap gap-x-6 gap-y-2"
              style={stagger(520)}
            >
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

        <div className="animate-fade-up min-w-0" style={stagger(300)}>
          <Tilt>
            <HeroCodeCard />
          </Tilt>
        </div>
      </Container>
    </section>
  )
}