import type { CSSProperties } from 'react'
import { ArrowRight, Download } from 'lucide-react'
import { about, hero, profile } from '../../data/portfolio'
import { getDisplaySize, splitName } from '../../lib/name'
import { hasContactDetails } from '../../lib/socialLinks'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { RotatingText } from '../ui/RotatingText'
import { SectionMarker } from '../ui/SectionMarker'
import { HeroTelemetry } from './HeroTelemetry'

const nameSizeClasses = {
  xl: 'text-display-xl',
  lg: 'text-display-lg',
  md: 'text-display-md',
  sm: 'text-display-sm',
}

/** Staggers the entrance animation of each hero element. */
const stagger = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

export function HeroSection() {
  const availability = hero.availability?.trim()
  const cvUrl = profile.cvUrl?.trim()
  const showContact = hasContactDetails(profile)

  const lines = splitName(profile.name)
  const sizeClass = nameSizeClasses[getDisplaySize(lines)]

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden border-b border-line"
    >
      {/* The page-wide cosmos shows through; this only adds a soft glow and a text scrim. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="scrim absolute inset-0" />
        <div className="animate-float absolute top-1/4 right-0 size-[30rem] rounded-full bg-accent-2/10 blur-3xl [animation-delay:-5s]" />
      </div>

      <Container size="wide" className="flex min-h-[calc(100svh-5rem)] flex-col py-6 sm:py-10">
        <div className="relative flex flex-1 items-center">
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
                    {/* The clipped box makes each line slide up into view. Its bottom
                        padding gives the descenders (g, y, p) room, so a tail is never
                        cut off, and the negative margin cancels it out in the layout. */}
                    <span className="-mb-[0.32em] block overflow-hidden pb-[0.12em]">
                      <span
                        className={`animate-line-up block pb-[0.2em] ${isLast ? 'text-gradient' : ''}`}
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
