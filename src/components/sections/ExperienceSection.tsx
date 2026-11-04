import { experience } from '../../data/portfolio'
import { formatPeriod } from '../../lib/period'
import { Badge } from '../ui/Badge'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

/** Each position shows its two most important contributions, no more. */
const MAX_BULLETS = 2

/** The three columns: dates on the left, the timeline in the middle, the details on the right. */
const columns = 'grid-cols-[1.5rem_1fr] md:grid-cols-[10rem_2rem_1fr] lg:grid-cols-[12rem_2.5rem_1fr]'

/**
 * Experience as a vertical timeline. A long glowing line runs down the left, each position
 * has a node on it, the dates sit to its left and the details to its right. The line draws
 * itself as each position scrolls into view and fades out below the last one.
 */
export function ExperienceSection() {
  if (experience.length === 0) return null

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="mt-16">
        {experience.map((entry, index) => {
          const period = formatPeriod(entry.startDate, entry.endDate)
          const bullets = entry.responsibilities.slice(0, MAX_BULLETS)
          const isCurrent = index === 0

          return (
            <li key={entry.id}>
              <Reveal delay={index * 100} className={`group/item grid gap-x-4 ${columns}`}>
                {/* Dates: above the details on phones, to the left of the timeline from md up. */}
                <div className="col-start-2 row-start-1 mb-3 md:col-start-1 md:mt-[0.95rem] md:mb-0 md:text-right">
                  {period && (
                    <p className="font-mono text-xs leading-relaxed tracking-[0.2em] text-accent uppercase">
                      {period}
                    </p>
                  )}
                  {entry.employmentType && (
                    <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                      {entry.employmentType}
                    </p>
                  )}
                </div>

                {/* The timeline: a glowing line and a node. */}
                <div className="relative col-start-1 row-span-2 row-start-1 md:col-start-2 md:row-span-1">
                  <span
                    aria-hidden="true"
                    className="absolute top-3 -bottom-px left-1/2 w-0.5 origin-top -translate-x-1/2 scale-y-0 bg-linear-to-b from-accent via-accent-2/70 to-accent-2/20 shadow-[0_0_0.9rem_color-mix(in_srgb,var(--accent)_70%,transparent)] transition-transform duration-1000 ease-out group-data-[visible=true]/item:scale-y-100"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-[0.15rem] left-1/2 size-4 -translate-x-1/2 md:top-[0.95rem]"
                  >
                    {isCurrent && (
                      <span className="absolute -inset-1.5 animate-ping rounded-full bg-accent-3/40" />
                    )}
                    <span className="relative block size-4 rounded-full border-2 border-accent-3 bg-background shadow-[0_0_1rem_var(--accent-3)]" />
                  </span>
                </div>

                {/* The details. The bottom padding is the space between positions, and it sits inside
                    the grid row so the timeline line runs through it without a gap. */}
                <div className="col-start-2 row-start-2 pb-20 md:col-start-3 md:row-start-1">
                  <h3 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] font-bold tracking-tight text-balance uppercase">
                    {entry.position}
                  </h3>
                  <p className="mt-3 text-sm font-medium tracking-[0.28em] text-accent uppercase">
                    {entry.organization}
                  </p>
                  {entry.location && (
                    <p className="mt-1 text-xs tracking-[0.2em] text-muted uppercase">
                      {entry.location}
                    </p>
                  )}

                  {entry.description && (
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/90">
                      {entry.description}
                    </p>
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
                    <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies used">
                      {entry.technologies.map((tech) => (
                        <li key={tech}>
                          <Badge>{tech}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            </li>
          )
        })}

        {/* The line keeps going and fades out below the last position. Decorative. */}
        <li aria-hidden="true" className={`grid gap-x-4 ${columns}`}>
          <span className="relative col-start-1 h-32 md:col-start-2">
            <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-linear-to-b from-accent-2/20 to-transparent" />
          </span>
        </li>
      </ol>
    </Section>
  )
}