import type { ReactNode } from 'react'
import { navItems } from '../../data/portfolio'
import { getSectionNumber } from '../../lib/navigation'
import { Container } from './Container'
import { Reveal } from './Reveal'
import { SectionMarker } from './SectionMarker'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
  className?: string
  /** "raised" gives a section a slightly lighter surface, to vary the rhythm of the page. */
  tone?: 'base' | 'raised'
}

const tones = {
  base: '',
  raised: 'bg-surface/30 backdrop-blur-[2px]',
}

/** The numbered marker, the rule and the large title that open every section. */
export function SectionHeader({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <>
      <div className="flex items-center gap-4">
        <SectionMarker index={getSectionNumber(navItems, id)} label={eyebrow} />
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-linear-to-r from-accent/40 via-line to-transparent"
        />
      </div>
      <h2 id={`${id}-heading`} className="text-headline mt-6 max-w-4xl text-balance">
        {title}
      </h2>
    </>
  )
}

/**
 * Shared wrapper for every section: one header style (a numbered marker that
 * matches the navbar, a large title, and a rule), consistent spacing, a reveal
 * animation, and the landmark label.
 */
export function Section({
  id,
  eyebrow,
  title,
  children,
  className = '',
  tone = 'base',
}: SectionProps) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`border-b border-line py-20 sm:py-28 ${tones[tone]} ${className}`}
    >
      <Container size="wide">
        <Reveal>
          <SectionHeader id={id} eyebrow={eyebrow} title={title} />
        </Reveal>
        <Reveal delay={120} className="mt-12">
          {children}
        </Reveal>
      </Container>
    </section>
  )
}
