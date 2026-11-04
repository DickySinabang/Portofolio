import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { hero, profile } from '../../data/portfolio'
import { splitName } from '../../lib/name'
import { hasContactDetails } from '../../lib/socialLinks'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { HeroTelemetry } from './HeroTelemetry'

/** Staggers the entrance animation of each hero element. */
const stagger = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

export function HeroSection() {
  const availability = hero.availability?.trim()
  const showContact = hasContactDetails(profile)

  const lines = splitName(profile.name)

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden border-b border-line"
    >
      {/* The page-wide cosmos shows through; this only adds a soft glow and a text scrim. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="scrim-center absolute inset-0" />
        <div className="animate-float absolute top-1/4 right-0 size-[30rem] rounded-full bg-accent-2/10 blur-3xl [animation-delay:-5s]" />
      </div>

      <Container size="wide" className="flex min-h-[calc(100svh-5rem)] flex-col py-6 sm:py-10">
        {/* The availability pill (shown only when set in the data) sits in the corner. */}
        {availability && (
          <p
            className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs text-muted backdrop-blur"
            style={stagger(0)}
          >
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent-3/60" />
              <span className="relative size-2 rounded-full bg-accent-3" />
            </span>
            {availability}
          </p>
        )}

        {/* The centred title stack: role, name, tagline, then the three buttons. */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-10 text-center sm:pb-24">
          <p
            className="animate-fade-up text-hero-eyebrow flex items-center gap-4 text-foreground sm:gap-6"
            style={stagger(120)}
          >
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-accent/60 sm:w-16" />
            {profile.title}
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-accent/60 sm:w-16" />
          </p>

          <h1 id="home-heading" className="text-hero-name mt-6 break-words sm:mt-8">
            {lines.map((line, index) => {
              const isLast = index === lines.length - 1
              return (
                <span key={index}>
                  {/* The clipped box makes each line slide up into view. Its bottom
                      padding gives the descenders room, and the negative margin
                      cancels it out in the layout. */}
                  <span className="-mb-[0.32em] block overflow-hidden pb-[0.12em]">
                    <span
                      className={`animate-line-up block pb-[0.2em] ${isLast ? 'text-gradient' : ''}`}
                      style={stagger(240 + index * 140)}
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
            className="animate-fade-up text-hero-eyebrow mt-8 max-w-xl text-muted"
            style={stagger(560)}
          >
            {hero.headline}
          </p>

          <div
            className="animate-fade-up mt-12 flex flex-wrap justify-center gap-3"
            style={stagger(700)}
          >
            <ButtonLink to="/#projects">
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