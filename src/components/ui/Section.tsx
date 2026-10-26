import type { ReactNode } from 'react'
import { Container } from './Container'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
  className?: string
}

/** Shared wrapper: consistent spacing, heading, reveal animation, and landmark label. */
export function Section({ id, eyebrow, title, children, className = '' }: SectionProps) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`border-b border-line py-20 sm:py-24 ${className}`}
    >
      <Container>
        <Reveal>
          <p className="font-mono text-sm text-accent">
            <span aria-hidden="true" className="text-accent-2">
              {'// '}
            </span>
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {title}
          </h2>
          <div
            aria-hidden="true"
            className="mt-5 h-px w-20 bg-linear-to-r from-accent to-accent-2"
          />
        </Reveal>
        <Reveal delay={120} className="mt-10">
          {children}
        </Reveal>
      </Container>
    </section>
  )
}