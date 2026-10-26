import type { NavItem, Profile, Project } from '../types/portfolio'
import { getSectionPath } from './navigation'
import { cleanUrl } from './projects'
import { getSocialLinks } from './socialLinks'

/** Describes WHAT a command does. The palette component decides HOW. */
export type CommandAction =
  | { type: 'navigate'; to: string }
  | { type: 'external'; href: string }
  | { type: 'mailto'; href: string }
  | { type: 'theme' }

export type PaletteCommand = {
  id: string
  label: string
  group: 'Go to' | 'Project' | 'Link' | 'Action'
  /** Extra words that should also match when searching. */
  keywords: string
  action: CommandAction
}

type BuildInput = {
  navItems: NavItem[]
  projects: Project[]
  profile: Profile
  theme: 'light' | 'dark'
}

/** Builds the list from real data, so it only contains things that exist. */
export function buildCommands({
  navItems,
  projects,
  profile,
  theme,
}: BuildInput): PaletteCommand[] {
  const commands: PaletteCommand[] = []

  for (const item of navItems) {
    commands.push({
      id: `section-${item.sectionId}`,
      label: item.label,
      group: 'Go to',
      keywords: item.sectionId,
      action: { type: 'navigate', to: getSectionPath(item.sectionId) },
    })
  }

  commands.push({
    id: 'section-terminal',
    label: 'Terminal',
    group: 'Go to',
    keywords: 'console commands interactive',
    action: { type: 'navigate', to: '/#terminal' },
  })

  for (const project of projects) {
    commands.push({
      id: `project-${project.slug}`,
      label: project.title,
      group: 'Project',
      keywords: [project.description, ...project.technologies].join(' '),
      action: { type: 'navigate', to: `/projects/${project.slug}` },
    })
  }

  for (const link of getSocialLinks(profile)) {
    commands.push({
      id: `link-${link.id}`,
      label: link.id === 'email' ? 'Send an email' : `Open ${link.label}`,
      group: 'Link',
      keywords: link.label,
      action: link.external
        ? { type: 'external', href: link.href }
        : { type: 'mailto', href: link.href },
    })
  }

  const cvUrl = cleanUrl(profile.cvUrl)
  if (cvUrl) {
    commands.push({
      id: 'link-cv',
      label: 'Open CV',
      group: 'Link',
      keywords: 'resume curriculum vitae pdf download',
      action: { type: 'external', href: cvUrl },
    })
  }

  commands.push({
    id: 'action-theme',
    label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
    group: 'Action',
    keywords: 'theme dark light mode appearance',
    action: { type: 'theme' },
  })

  return commands
}

/** Every word typed must appear somewhere in the command's text. */
export function filterCommands(
  commands: PaletteCommand[],
  query: string,
): PaletteCommand[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return commands

  return commands.filter((command) => {
    const haystack = `${command.label} ${command.keywords} ${command.group}`.toLowerCase()
    return tokens.every((token) => haystack.includes(token))
  })
}