import { ArrowUpRight } from 'lucide-react'
import { highlights } from '../../data/portfolio'
import { cleanUrl } from '../../lib/projects'
import { Section } from '../ui/Section'

export function HighlightsSection() {
  if (highlights.length === 0) return null

  return (
    <Section id="highlights" eyebrow="Highlights" title="Learning highlights">
      <ul className="grid gap-6 md:grid-cols-2">
        {highlights.map((item) => {
          const meta = [item.kind, item.period].filter(Boolean).join(' · ')
          const url = cleanUrl(item.url)

          return (
            <li key={item.id} className="rounded-lg border border-line bg-surface p-6">
              {meta && <p className="font-mono text-xs text-accent">{meta}</p>}
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>

              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-opacity hover:opacity-80"
                >
                  {item.urlLabel ?? 'Learn more'}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                  <span className="sr-only"> for {item.title} (opens in a new tab)</span>
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}