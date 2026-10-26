import type {
  AboutContent,
  ExperienceEntry,
  Profile,
  Project,
  SkillCategory,
} from '../types/portfolio'
import { formatPeriod } from './period'
import { projectCategoryLabels } from './projects'
import { getVisibleSkillCategories } from './skills'
import { getSocialLinks } from './socialLinks'

export type TerminalContext = {
  profile: Profile
  about: AboutContent
  skillCategories: SkillCategory[]
  experience: ExperienceEntry[]
  projects: Project[]
}

export type TerminalResult = { clear: true } | { lines: string[] }

export const terminalCommands = [
  { name: 'help', description: 'List available commands' },
  { name: 'about', description: 'Who I am' },
  { name: 'skills', description: 'Technologies I use or am learning' },
  { name: 'experience', description: 'Where I have worked' },
  { name: 'projects', description: 'Things I have built' },
  { name: 'contact', description: 'How to reach me' },
  { name: 'clear', description: 'Clear the screen' },
] as const

/** Turns one typed command into output lines. Everything comes from the data file. */
export function runTerminalCommand(input: string, ctx: TerminalContext): TerminalResult {
  const command = input.trim().toLowerCase()

  switch (command) {
    case 'help':
      return {
        lines: [
          'Available commands:',
          ...terminalCommands.map(
            (item) => `  ${item.name.padEnd(12)}${item.description}`,
          ),
        ],
      }

    case 'clear':
      return { clear: true }

    case 'about': {
      const { profile, about } = ctx
      const lines = [`${profile.name} - ${profile.title}`, '']
      for (const paragraph of about.paragraphs) lines.push(paragraph, '')
      lines.push(
        `Education: ${about.education.degree}, ${about.education.institution} (${about.education.status})`,
      )
      return { lines }
    }

    case 'skills': {
      const categories = getVisibleSkillCategories(ctx.skillCategories)
      if (categories.length === 0) return { lines: ['No skills are listed yet.'] }
      return {
        lines: categories.map((category) => {
          const names = category.skills.map((skill) =>
            skill.status === 'learning' ? `${skill.name} (learning)` : skill.name,
          )
          return `${category.title}: ${names.join(', ')}`
        }),
      }
    }

    case 'experience': {
      if (ctx.experience.length === 0) return { lines: ['No experience is listed yet.'] }
      const lines: string[] = []
      for (const entry of ctx.experience) {
        lines.push(`${entry.position} @ ${entry.organization}`)
        const period = formatPeriod(entry.startDate, entry.endDate)
        if (period) lines.push(`  ${period}`)
        if (entry.description) lines.push(`  ${entry.description}`)
        for (const item of entry.responsibilities) lines.push(`  - ${item}`)
        lines.push('')
      }
      return { lines }
    }

    case 'projects': {
      if (ctx.projects.length === 0) return { lines: ['No projects are listed yet.'] }
      const lines: string[] = []
      for (const project of ctx.projects) {
        lines.push(`${project.title} [${projectCategoryLabels[project.category]}]`)
        lines.push(`  ${project.description}`)
        lines.push(`  Details: /projects/${project.slug}`, '')
      }
      return { lines }
    }

    case 'contact': {
      const lines = getSocialLinks(ctx.profile).map(
        (link) => `${link.label}: ${link.href.replace(/^mailto:/, '')}`,
      )
      const cvUrl = ctx.profile.cvUrl?.trim()
      if (cvUrl) lines.push(`CV: ${cvUrl}`)
      if (lines.length === 0) {
        return { lines: ['No public contact details are listed yet.'] }
      }
      return { lines }
    }

    default:
      return {
        lines: [
          `command not found: ${input.trim()}`,
          "Type 'help' to see available commands.",
        ],
      }
  }
}