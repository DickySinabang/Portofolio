import { experience } from '../../data/portfolio'
import { formatPeriod } from '../../lib/period'
import { Badge } from '../ui/Badge'
import { Section } from '../ui/Section'

const MAX_BULLETS = 2

export function ExperienceSection() {
  if (experience.length === 0) return null

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-12 pl-8 before:absolute before:top-3 before:bottom-3 before:left-[0.4rem] before:w-px before:bg-linear-to-b before:from-accent before:via-accent-2 before:to-transparent">
        {experience.map((entry) => {
          const period = formatPeriod(entry.startDate, entry.endDate)
          const meta = [entry.organization, entry.location, entry.employmentType].filter(Boolean)
          const bullets = entry.responsibilities.slice(0, MAX_BULLETS)

          return (
            <li
              key={entry.id}
              className="relative rounded-xl border border-line bg-surface/60 p-6 backdrop-blur-sm sm:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute top-8 -left-[1.95rem] size-3 rounded-full bg-accent-3 shadow-[0_0_0.9rem_var(--accent-3)] ring-4 ring-background/80 sm:top-12"
              />

              {period && (
                <p className="inline-flex rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
                  {period}
                </p>
              )}
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                {entry.position}
              </h3>
              <p className="mt-2 text-sm text-muted">{meta.join(' · ')}</p>

              {entry.description && (
                <p className="mt-6 max-w-2xl text-lg text-foreground/90">{entry.description}</p>
              )}

              {bullets.length > 0 && (
                <ul className="mt-4 max-w-2xl space-y-2 text-muted">
                  {bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {entry.technologies.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies used">
                  {entry.technologies.map((tech) => (
                    <li key={tech}>
                      <Badge>{tech}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </Section>
  )
}