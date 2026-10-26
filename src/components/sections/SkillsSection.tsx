import {
  Code,
  Cpu,
  Database,
  Monitor,
  Server,
  Smartphone,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { skillCategories } from '../../data/portfolio'
import { getVisibleSkillCategories } from '../../lib/skills'
import type { Skill } from '../../types/portfolio'
import { Section } from '../ui/Section'

const categoryIcons: Record<string, LucideIcon> = {
  frontend: Monitor,
  backend: Server,
  languages: Code,
  database: Database,
  mobile: Smartphone,
  'iot-ml': Cpu,
  tools: Wrench,
}

function SkillBadge({ skill }: { skill: Skill }) {
  const learning = skill.status === 'learning'

  return (
    <li
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm ${
        learning ? 'border-dashed border-accent' : 'border-line bg-background'
      }`}
    >
      {skill.name}
      {/* Visible text, so the status is not communicated by the border style alone. */}
      {learning && <span className="text-xs text-muted">Learning</span>}
    </li>
  )
}

export function SkillsSection() {
  const categories = getVisibleSkillCategories(skillCategories)
  if (categories.length === 0) return null

  const showLegend = categories.some((category) =>
    category.skills.some((skill) => skill.status === 'learning'),
  )

  return (
    <Section id="skills" eyebrow="Skills" title="Tools and technologies">
      {showLegend && (
        <p className="mb-8 max-w-2xl text-sm text-muted">
          Solid badges are technologies I have worked with. Dashed badges marked
          &ldquo;Learning&rdquo; are ones I am currently studying.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id] ?? Code
          return (
            <div key={category.id} className="rounded-lg border border-line bg-surface p-6">
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <Icon aria-hidden="true" className="size-5 text-accent" />
                {category.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}