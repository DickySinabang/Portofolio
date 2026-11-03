import { experience } from '../../data/portfolio'
import { formatPeriod } from '../../lib/period'
import { Badge } from '../ui/Badge'
import { Section } from '../ui/Section'

/** Experience as a flight log: a glowing line down the page, one node per position. */
export function ExperienceSection() {
  if (experience.length === 0) return null

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-8 pl-8 before:absolute before:top-3 before:bottom-3 before:left-[0.4rem] before:w-px before:bg-linear-to-b before:from-accent before:via-accent-2 before:to-transparent">
        {experience.map((entry) => {
          const period = formatPeriod(entry.startDate, entry.endDate)
          const meta = [entry.organization, entry.location, entry.employmentType].filter(Boolean)

          return (
            <li
              key={entry.id}
              className="relative rounded-xl border border-line bg-surface/60 p-6 backdrop-blur-sm sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute top-8 -left-[1.95rem] size-3 rounded-full bg-accent-3 shadow-[0_0_0.9rem_var(--accent-3)] ring-4 ring-background/80"
              />

              {period && (
                <p className="inline-flex rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
                  {period}
                </p>
              )}
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{entry.position}</h3>
              <p className="mt-1 text-sm text-muted">{meta.join(' · ')}</p>

              {entry.description && (
                <p className="mt-4 max-w-2xl text-muted">{entry.description}</p>
              )}

              {entry.responsibilities.length > 0 && (
                <ul className="mt-4 max-w-2xl space-y-2 text-muted">
                  {entry.responsibilities.map((item) => (
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
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
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
