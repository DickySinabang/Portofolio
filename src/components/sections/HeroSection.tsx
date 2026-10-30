import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'
import { about, hero, profile } from '../../data/portfolio'
import { getDisplaySize, splitName } from '../../lib/name'
import { getSocialLinks, hasContactDetails } from '../../lib/socialLinks'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { RotatingText } from '../ui/RotatingText'
import { SectionMarker } from '../ui/SectionMarker'
import { HeroArtifact } from './HeroArtifact'
import { HeroCodeCard } from './HeroCodeCard'
import { HeroTelemetry } from './HeroTelemetry'
import { ParticleField } from './ParticleField'

const nameSizeClasses = {
  xl: 'text-display-xl',
  lg: 'text-display-lg',
  md: 'text-display-md',
  sm: 'text-display-sm',
}

/** Staggers the entrance animation of each hero element. */
const stagger = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

const floorGrid: CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, color-mix(in srgb, var(--accent) 30%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--accent) 30%, transparent) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
}

/** Layered decoration: blueprint grid, perspective floor, glows, particles, grain. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="bg-grid absolute inset-0 opacity-50" />

      {/* A grid floor receding to the horizon; it flows toward the viewer. */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden [mask-image:linear-gradient(to_top,#000_8%,transparent_92%)] [perspective:520px]">
        <div className="absolute inset-x-[-70%] top-0 bottom-0 origin-bottom [transform:rotateX(64deg)]">
          <div className="animate-grid-flow absolute inset-x-0 -top-16 bottom-0" style={floorGrid} />
        </div>
      </div>

      <div className="animate-float absolute -top-10 -left-32 size-[28rem] rounded-full bg-accent/15 blur-3xl" />
      <div className="animate-float absolute -right-24 bottom-0 size-[26rem] rounded-full bg-accent-2/15 blur-3xl [animation-delay:-7s]" />

      <ParticleField className="absolute inset-0 size-full" />
      <div className="bg-noise absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  )
}

export function HeroSection() {
  const availability = hero.availability?.trim()
  const cvUrl = profile.cvUrl?.trim()
  const socialLinks = getSocialLinks(profile)
  const showContact = hasContactDetails(profile)

  const lines = splitName(profile.name)
  const sizeClass = nameSizeClasses[getDisplaySize(lines)]

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden border-b border-line"
    >
      <HeroBackdrop />

      <Container size="wide" className="flex min-h-[calc(100svh-5rem)] flex-col py-6 sm:py-10">
        <div className="relative flex flex-1 items-center">
          {/* The artifact sits behind the text so the name can overlap it. */}
          <div className="pointer-events-none absolute top-0 -right-16 w-[min(80vw,26rem)] opacity-60 sm:-right-8 md:w-[22rem] lg:top-1/2 lg:right-0 lg:w-[min(40vw,36rem)] lg:-translate-y-1/2 lg:opacity-100 xl:right-20">
            <HeroArtifact />
            <HeroCodeCard className="absolute -bottom-2 -left-24 hidden w-72 lg:block xl:-left-32" />
          </div>

          <div className="relative z-10 max-w-5xl py-4 sm:py-6">
            <div
              className="animate-fade-up flex flex-wrap items-center gap-x-5 gap-y-3"
              style={stagger(0)}
            >
              <SectionMarker index="01" label="Intro" />
              {availability && (
                <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs text-muted backdrop-blur">
                  <span aria-hidden="true" className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent-3/60" />
                    <span className="relative size-2 rounded-full bg-accent-3" />
                  </span>
                  {availability}
                </p>
              )}
            </div>

            <h1 id="home-heading" className={`${sizeClass} mt-6 break-words`}>
              {lines.map((line, index) => {
                const isLast = index === lines.length - 1
                return (
                  <span key={index}>
                    {/* The clipped box makes each line slide up into view. */}
                    <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                      <span
                        className={`animate-line-up block ${isLast ? 'text-gradient' : ''}`}
                        style={stagger(120 + index * 120)}
                      >
                        {line}
                      </span>
                    </span>
                    {!isLast && ' '}
                  </span>
                )
              })}
            </h1>

            <p
              className="animate-fade-up mt-6 flex items-center gap-3 font-display text-xl font-medium sm:text-2xl lg:text-3xl"
              style={stagger(380)}
            >
              <span aria-hidden="true" className="h-px w-8 shrink-0 bg-accent sm:w-12" />
              {profile.title}
            </p>
            <p className="animate-fade-up mt-4 text-base text-foreground sm:text-lg" style={stagger(460)}>
              {hero.headline}
            </p>
            <p
              className="animate-fade-up mt-3 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
              style={stagger(520)}
            >
              {hero.intro}
            </p>

            <div className="animate-fade-up mt-6" style={stagger(580)}>
              <RotatingText prefix="Currently interested in" words={about.interests} />
            </div>

            <div
              className="animate-fade-up mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap"
              style={stagger(640)}
            >
              <ButtonLink to="/#projects" className="col-span-2 sm:col-auto">
                View My Projects
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
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
                style={stagger(700)}
              >
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {link.external && (
                        <>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                          <span className="sr-only">, opens in a new tab</span>
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative z-10 hidden items-end justify-between gap-6 pt-4 sm:flex">
          <div
            aria-hidden="true"
            className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-muted uppercase"
          >
            <span className="relative h-10 w-px overflow-hidden bg-line">
              <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent" />
            </span>
            Scroll
          </div>
          <HeroTelemetry />
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent"
      />
    </section>
  )
}
