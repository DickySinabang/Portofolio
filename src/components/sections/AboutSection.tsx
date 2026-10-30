import { Compass, Lightbulb } from 'lucide-react'
import { about, experience, profile } from '../../data/portfolio'
import { buildPath } from '../../lib/about'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { AboutPath } from './about/AboutPath'
import { ListPanel } from './about/ListPanel'
import { ProfilePanel } from './about/ProfilePanel'

export function AboutSection() {
  const { paragraphs, interests, approach } = about
  const [lead, ...rest] = paragraphs
  const path = buildPath({ about, experience, profile })
  const hasLists = interests.length > 0 || approach.length > 0

  return (
    <Section id="about" eyebrow="About" title="A little about me" tone="raised">
      {/* Story on the left, identity panel on the right; both stretch to the same height. */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col justify-center gap-6 lg:col-span-7">
          {lead && (
            <p className="font-display text-2xl leading-snug text-balance sm:text-3xl">{lead}</p>
          )}
          {rest.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        <Reveal variant="left" delay={100} className="flex flex-col lg:col-span-5">
          <ProfilePanel className="flex-1" />
        </Reveal>
      </div>

      <AboutPath nodes={path} className="mt-16" />

      {hasLists && (
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {interests.length > 0 && (
            <ListPanel title="Interests" icon={Compass} items={interests} />
          )}
          {approach.length > 0 && (
            <ListPanel
              title="How I approach learning"
              icon={Lightbulb}
              items={approach}
              ordered
            />
          )}
        </div>
      )}
    </Section>
  )
}
