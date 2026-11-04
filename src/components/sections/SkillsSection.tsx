import type { CSSProperties } from 'react'
import {
  BrainCircuit,
  Code,
  Cpu,
  Database,
  Layers,
  LayoutTemplate,
  Server,
  Smartphone,
  Webhook,
  type LucideIcon,
} from 'lucide-react'
import { skillCategories } from '../../data/portfolio'
import { getVisibleSkillCategories } from '../../lib/skills'
import { getSkillVisual, type SkillVisual } from '../../lib/skillIcons'
import type { Skill, SkillCategory } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SpotlightCard } from '../ui/SpotlightCard'

/**
 * How wide each card is, by category id. On large screens the grid has 12 columns:
 * Frontend (7) beside a tall Backend (5), Database (7) under Frontend, then Mobile (4),
 * IoT (3) and Machine Learning (5). On medium screens there are two columns, on phones one.
 * A category that is not listed here gets the default width.
 */
const layouts: Record<string, string> = {
  frontend: 'md:col-span-2 lg:col-span-7',
  backend: 'lg:col-span-5 lg:row-span-2',
  'database-tools': 'lg:col-span-7',
  mobile: 'lg:col-span-4',
  iot: 'lg:col-span-3',
  'machine-learning': 'md:col-span-2 lg:col-span-5',
}
const DEFAULT_LAYOUT = 'lg:col-span-4'

/** The categories with the largest titles. */
const featured = new Set(['frontend', 'backend'])

/** A small icon in the corner of each card, by category id. */
const categoryIcons: Record<string, LucideIcon> = {
  frontend: LayoutTemplate,
  backend: Server,
  'database-tools': Database,
  mobile: Smartphone,
  iot: Cpu,
  'machine-learning': BrainCircuit,
}

/** Used for skills that have no brand logo (a concept rather than a product). */
const fallbackIcons: Record<SkillVisual['fallback'], LucideIcon> = {
  api: Webhook,
  iot: Cpu,
  ml: BrainCircuit,
  generic: Code,
}

function SkillChip({ skill }: { skill: Skill }) {
  const visual = getSkillVisual(skill.name)
  const FallbackIcon = fallbackIcons[visual.fallback]
  const learning = skill.status === 'learning'

  return (
    <li>
      <span
        // The chip glows in its technology's own colour on hover (see .skill-chip).
        style={visual.brandColor ? ({ '--brand': visual.brandColor } as CSSProperties) : undefined}
        className={`skill-chip inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-xs tracking-wide text-foreground uppercase ${
          learning ? 'border-dashed border-accent/60 bg-surface/40' : 'border-line bg-surface/70'
        }`}
      >
        {visual.brandPath ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="skill-chip-icon size-4 shrink-0 fill-current text-foreground/80"
          >
            <path d={visual.brandPath} />
          </svg>
        ) : (
          <FallbackIcon
            aria-hidden="true"
            strokeWidth={1.5}
            className="skill-chip-icon size-4 shrink-0 text-foreground/80"
          />
        )}
        {visual.label}
        {/* Visible text, so a skill being learned is not marked by its dashed border alone. */}
        {learning && <span className="text-[10px] tracking-[0.14em] text-accent">Learning</span>}
      </span>
    </li>
  )
}

function SkillCard({ category, index }: { category: SkillCategory; index: number }) {
  const Icon = categoryIcons[category.id] ?? Layers
  const isFeatured = featured.has(category.id)

  return (
    <Reveal delay={index * 90} className={`h-full ${layouts[category.id] ?? DEFAULT_LAYOUT}`}>
      <SpotlightCard as="article" className="h-full">
        <div className="flex h-full flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            {category.label ? (
              <p className="font-mono text-[11px] tracking-[0.28em] text-accent uppercase">
                {category.label}
              </p>
            ) : (
              <span />
            )}
            <Icon
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-6 shrink-0 text-muted/70 transition-colors duration-300 group-hover:text-accent"
            />
          </div>

          <h3
            className={`mt-5 font-display leading-[1.05] font-bold tracking-tight text-balance uppercase ${
              isFeatured
                ? 'text-[clamp(1.75rem,3.2vw,2.75rem)]'
                : 'text-[clamp(1.4rem,2.4vw,1.9rem)]'
            }`}
          >
            {category.title}
          </h3>

          <span
            aria-hidden="true"
            className="my-5 block h-px w-full bg-linear-to-r from-accent/40 via-line to-transparent"
          />

          {category.description && (
            <p className="max-w-md text-base leading-relaxed text-muted">{category.description}</p>
          )}

          <ul
            aria-label={`${category.title} technologies`}
            className="mt-auto flex flex-wrap gap-2 pt-8"
          >
            {category.skills.map((skill) => (
              <SkillChip key={skill.name} skill={skill} />
            ))}
          </ul>
        </div>
      </SpotlightCard>
    </Reveal>
  )
}

export function SkillsSection() {
  const categories = getVisibleSkillCategories(skillCategories)

  if (categories.length === 0) return null

  return (
    <Section id="skills" eyebrow="Skills" title="Tools and technologies">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {categories.map((category, index) => (
          <SkillCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </Section>
  )
}