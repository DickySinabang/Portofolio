import { describe, expect, it } from 'vitest'
import { fullProject, testProfile } from '../test/fixtures'
import { buildCommands, filterCommands } from './commands'

const navItems = [
  { label: 'Home', sectionId: 'home' },
  { label: 'Projects', sectionId: 'projects' },
]

function build(overrides: Partial<Parameters<typeof buildCommands>[0]> = {}) {
  return buildCommands({
    navItems,
    projects: [fullProject],
    profile: testProfile,
    theme: 'dark',
    ...overrides,
  })
}

describe('buildCommands', () => {
  it('builds commands only from real data', () => {
    expect(build().map((command) => command.id)).toEqual([
      'section-home',
      'section-projects',
      'project-full-project',
      'link-email',
      'link-github',
      'action-theme',
    ])
  })

  it('offers the Terminal command only when the terminal section is shown', () => {
    expect(build({ terminal: true }).map((command) => command.id)).toContain('section-terminal')
    expect(build().map((command) => command.id)).not.toContain('section-terminal')
  })

  it('creates the right action for each kind of command', () => {
    const commands = build()
    const byId = (id: string) => commands.find((command) => command.id === id)

    expect(byId('section-home')?.action).toEqual({ type: 'navigate', to: '/' })
    expect(byId('project-full-project')?.action).toEqual({
      type: 'navigate',
      to: '/projects/full-project',
    })
    expect(byId('link-email')?.action).toEqual({
      type: 'mailto',
      href: 'mailto:test@example.com',
    })
    expect(byId('link-github')?.action).toEqual({
      type: 'external',
      href: 'https://github.com/DickySinabang/Portofolio',
    })
  })

  it('only adds a CV command when a CV exists', () => {
    expect(build().some((command) => command.id === 'link-cv')).toBe(false)

    const withCv = build({ profile: { ...testProfile, cvUrl: '/cv/test.pdf' } })
    expect(withCv.find((command) => command.id === 'link-cv')?.action).toEqual({
      type: 'external',
      href: '/cv/test.pdf',
    })
  })

  it('labels the theme command for the theme you would switch to', () => {
    const label = (theme: 'light' | 'dark') =>
      build({ theme }).find((command) => command.id === 'action-theme')?.label

    expect(label('dark')).toBe('Switch to light theme')
    expect(label('light')).toBe('Switch to dark theme')
  })
})

describe('filterCommands', () => {
  const commands = build()

  it('returns everything for an empty query', () => {
    expect(filterCommands(commands, '  ')).toHaveLength(commands.length)
  })

  it('matches labels and keywords, ignoring case', () => {
    expect(filterCommands(commands, 'REACT').map((command) => command.id)).toEqual([
      'project-full-project',
    ])
  })

  it('requires every typed word to match', () => {
    expect(filterCommands(commands, 'full react')).toHaveLength(1)
    expect(filterCommands(commands, 'full zzz')).toHaveLength(0)
  })

  it('returns nothing for a query that matches nothing', () => {
    expect(filterCommands(commands, 'zzzz')).toEqual([])
  })
})