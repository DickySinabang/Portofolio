import type { ReactNode } from 'react'
import { Container } from './Container'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
  className?: string
}


export function Section({ id, eyebrow, title, children, className = '' }: SectionProps) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`border-b border-line py-20 sm:py-24 ${className}`}
    >
      <Container>
        <p className="font-mono text-sm text-accent">{eyebrow}</p>
        <h2
          id={headingId}
          className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  )
}