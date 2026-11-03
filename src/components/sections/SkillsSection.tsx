import { BrainCircuit, Code, Cpu, Webhook, type LucideIcon } from 'lucide-react'
import { skillCategories } from '../../data/portfolio'
import { getAllSkills } from '../../lib/skills'
import { getSkillVisual, type SkillVisual } from '../../lib/skillIcons'
import type { Skill } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

/** Used for skills that have no brand logo (a concept rather than a product). */
const fallbackIcons: Record<SkillVisual['fallback'], LucideIcon> = {
  api: Webhook,
  iot: Cpu,
  ml: BrainCircuit,
  generic: Code,
}

const iconClass =
  'size-9 text-foreground/80 transition-colors duration-300 group-hover:text-accent sm:size-10'

function SkillTile({ skill, index }: { skill: Skill; index: number }) {
  const visual = getSkillVisual(skill.name)
  const FallbackIcon = fallbackIcons[visual.fallback]
  const learning = skill.status === 'learning'

  return (
    <li>
      {/* The delay repeats every row, so each row ripples in from the left. */}
      <Reveal delay={(index % 7) * 60} className="h-full">
        <div
          className={`group relative flex h-full min-h-32 flex-col items-center justify-center gap-4 rounded-xl border px-3 py-6 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_2rem_-0.6rem_var(--accent)] ${
            learning ? 'border-dashed border-accent/60 bg-surface/40' : 'border-line bg-surface/60'
          }`}
        >
          {visual.brandPath ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className={`${iconClass} fill-current`}>
              <path d={visual.brandPath} />
            </svg>
          ) : (
            <FallbackIcon aria-hidden="true" strokeWidth={1.5} className={iconClass} />
          )}
          <span className="font-mono text-xs tracking-wide text-muted transition-colors duration-300 group-hover:text-foreground">
            {visual.label}
          </span>
          {/* Visible text, so a skill being learned is not marked by its dashed border alone. */}
          {learning && (
            <span className="absolute top-2 right-2.5 font-mono text-[10px] tracking-[0.12em] text-accent uppercase">
              Learning
            </span>
          )}
        </div>
      </Reveal>
    </li>
  )
}

export function SkillsSection() {
  const skills = getAllSkills(skillCategories)

  if (skills.length === 0) return null

  return (
    <Section id="skills" eyebrow="Skills" title="Tools and technologies">
      <ul
        aria-label="Technologies"
        className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-7"
      >
        {skills.map((skill, index) => (
          <SkillTile key={skill.name} skill={skill} index={index} />
        ))}
      </ul>
    </Section>
  )
}