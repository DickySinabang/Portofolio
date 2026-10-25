import { GraduationCap, Lightbulb } from 'lucide-react'
import { about } from '../../data/portfolio'
import { Badge } from '../ui/Badge'
import { Section } from '../ui/Section'

export function AboutSection() {
  const { paragraphs, education, interests, approach, photo } = about

  return (
    <Section id="about" eyebrow="About" title="A little about me">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {approach.length > 0 && (
            <div className="mt-10">
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <Lightbulb aria-hidden="true" className="size-5 text-accent" />
                How I approach learning
              </h3>
              <ul className="mt-4 space-y-3 text-muted">
                {approach.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {photo && (
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="aspect-square w-full max-w-sm rounded-lg border border-line object-cover"
            />
          )}

          <div className="rounded-lg border border-line bg-surface p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              <GraduationCap aria-hidden="true" className="size-5 text-accent" />
              Education
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Degree</dt>
                <dd className="font-medium">{education.degree}</dd>
              </div>
              <div>
                <dt className="text-muted">Institution</dt>
                <dd className="font-medium">{education.institution}</dd>
              </div>
              <div>
                <dt className="text-muted">Status</dt>
                <dd className="font-medium">{education.status}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-line bg-surface p-6">
            <h3 className="text-lg font-medium">Interests</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <li key={interest}>
                  <Badge>{interest}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}