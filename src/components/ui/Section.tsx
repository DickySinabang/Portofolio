import type { ReactNode } from 'react'
import { Container } from './Container'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  eyebrow?: string
  title: string
  children: ReactNode
  className?: string
  tone?: 'base' | 'raised'
}

const tones = {
  base: 'bg-[var(--veil)]',
  raised: 'bg-surface/30 backdrop-blur-[2px]',
}

export function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="block h-px w-full bg-linear-to-r from-accent/40 via-line to-transparent"
      />
      <h2 id={`${id}-heading`} className="text-headline mt-6 max-w-4xl text-balance">
        {title}
      </h2>
    </>
  )
}

export function Section({
  id,
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
          <SectionHeader id={id} title={title} />
        </Reveal>
        <Reveal delay={120} className="mt-12">
          {children}
        </Reveal>
      </Container>
    </section>
  )
}
