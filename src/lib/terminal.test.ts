import { describe, expect, it } from 'vitest'
import {
  fullProject,
  testAbout,
  testExperience,
  testProfile,
  testSkillCategories,
} from '../test/fixtures'
import { runTerminalCommand, type TerminalContext, type TerminalResult } from './terminal'

const context: TerminalContext = {
  profile: testProfile,
  about: testAbout,
  skillCategories: testSkillCategories,
  experience: testExperience,
  projects: [fullProject],
}

const emptyContext: TerminalContext = {
  profile: { name: 'A', title: 'B' },
  about: testAbout,
  skillCategories: [],
  experience: [],
  projects: [],
}

function linesOf(result: TerminalResult): string[] {
  if ('clear' in result) throw new Error('Expected output lines, got "clear"')
  return result.lines
}

describe('runTerminalCommand', () => {
  it('lists commands for help, ignoring case and spaces', () => {
    const lines = linesOf(runTerminalCommand('  HELP ', context))
    expect(lines[0]).toBe('Available commands:')
    expect(lines.some((line) => line.trim().startsWith('skills'))).toBe(true)
  })

  it('clears the screen', () => {
    expect(runTerminalCommand('clear', context)).toEqual({ clear: true })
  })

  it('describes the person for "about"', () => {
    const lines = linesOf(runTerminalCommand('about', context))
    expect(lines[0]).toBe('Test Person - Test Developer')
    expect(lines).toContain('Education: BSc Test, Test University (Graduate)')
  })

  it('lists skills by category and skips empty categories', () => {
    expect(linesOf(runTerminalCommand('skills', context))).toEqual([
      'Frontend Development: React, Vue (learning)',
    ])
  })

  it('shows experience with its period', () => {
    const lines = linesOf(runTerminalCommand('experience', context))
    expect(lines).toContain('Intern @ Test Corp')
    expect(lines).toContain('  Jan 2025 – Jun 2025')
  })

  it('lists projects with their detail path', () => {
    const lines = linesOf(runTerminalCommand('projects', context))
    expect(lines).toContain('Full Project [Web Development]')
    expect(lines).toContain('  Details: /projects/full-project')
  })

  it('shows contact details without the mailto: prefix', () => {
    expect(linesOf(runTerminalCommand('contact', context))).toEqual([
      'Email: test@example.com',
      'GitHub: https://github.com/DickySinabang/Portofolio',
    ])
  })

  it('says so honestly when there is no data', () => {
    const say = (command: string) => linesOf(runTerminalCommand(command, emptyContext))

    expect(say('skills')).toEqual(['No skills are listed yet.'])
    expect(say('experience')).toEqual(['No experience is listed yet.'])
    expect(say('projects')).toEqual(['No projects are listed yet.'])
    expect(say('contact')).toEqual(['No public contact details are listed yet.'])
  })

  it('reports unknown commands', () => {
    const lines = linesOf(runTerminalCommand('nonsense', context))
    expect(lines[0]).toBe('command not found: nonsense')
  })
})