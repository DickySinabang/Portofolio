import { GraduationCap } from 'lucide-react'
import { about, experience, profile } from '../../data/portfolio'
import { buildPath } from '../../lib/about'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { AboutPath } from './about/AboutPath'
import { AboutPortrait } from './about/AboutPortrait'

const DEFAULT_HEADLINE: [string, string] = ['A little', 'about me']

export function AboutSection() {
  const { education, photo } = about
  const [first, second] = about.headline ?? DEFAULT_HEADLINE
  const description = about.paragraphs[0]
  const path = buildPath({ about, experience, profile })
  const textColumn = photo ? 'lg:col-span-7' : 'lg:col-span-12'

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-line bg-surface/30 py-20 backdrop-blur-[2px] sm:py-28"
    >
      <Container size="wide">
        {/* On phones the three blocks stack as headline, photo, details (see the order classes).
            From lg up, the headline and details form one centred column beside the photo. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className={`contents lg:flex lg:flex-col lg:gap-10 ${textColumn}`}>
            <Reveal className="order-1 lg:order-none">
              <h2
                id="about-heading"
                className="font-display text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.95] font-bold tracking-tight text-balance uppercase"
              >
                <span className="block">{first}</span>{' '}
                <span className="text-gradient block pb-[0.1em]">{second}</span>
              </h2>
            </Reveal>

            <Reveal delay={120} className="order-3 lg:order-none">
              <p className="font-display text-2xl font-semibold tracking-tight break-words sm:text-3xl">
                {profile.name}
              </p>
              <p className="mt-2 font-mono text-xs tracking-[0.3em] text-accent uppercase sm:text-sm">
                {profile.title}
              </p>

              <span
                aria-hidden="true"
                className="my-8 block h-px w-full max-w-xl bg-linear-to-r from-accent/50 via-line to-transparent"
              />

              {description && (
                <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{description}</p>
              )}

              <p className="mt-6 flex max-w-xl items-start gap-3 text-sm text-foreground/90 sm:text-base">
                <GraduationCap aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
                <span>
                  {education.degree} · {education.institution}
                </span>
              </p>
            </Reveal>
          </div>

          {photo && (
            <Reveal
              variant="fade"
              delay={150}
              className="order-2 lg:order-none lg:col-span-5 lg:col-start-8"
            >
              <AboutPortrait src={photo.src} alt={photo.alt} />
            </Reveal>
          )}
        </div>

        <AboutPath nodes={path} className="mt-24 sm:mt-32" />
      </Container>
    </section>
  )
}