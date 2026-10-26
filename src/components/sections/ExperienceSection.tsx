import { experience } from '../../data/portfolio'
import { formatPeriod } from '../../lib/period'
import { Badge } from '../ui/Badge'
import { Section } from '../ui/Section'

export function ExperienceSection() {
  if (experience.length === 0) return null

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-10 border-l border-line pl-8">
        {experience.map((entry) => {
          const period = formatPeriod(entry.startDate, entry.endDate)
          const meta = [entry.organization, entry.location, entry.employmentType].filter(Boolean)

          return (
            <li key={entry.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[2.4rem] top-2 size-3 rounded-full border-2 border-accent bg-background"
              />

              <h3 className="text-xl font-semibold tracking-tight">{entry.position}</h3>
              <p className="mt-1 text-sm text-muted">{meta.join(' · ')}</p>
              {period && <p className="mt-1 font-mono text-sm text-accent">{period}</p>}

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