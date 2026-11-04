import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SkillsSection } from './SkillsSection'

vi.mock('../../data/portfolio', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/portfolio')>()),
  skillCategories: [
    {
      id: 'frontend',
      title: 'Frontend Development',
      label: 'Interface',
      description: 'Building web interfaces.',
      skills: [
        { name: 'React', status: 'used' },
        { name: 'Tailwind CSS', status: 'used' },
      ],
    },
    {
      id: 'backend',
      title: 'Backend Development',
      skills: [
        { name: 'Laravel', status: 'used' },
        { name: 'REST API development', status: 'used' },
        { name: 'Go', status: 'learning' },
      ],
    },
    { id: 'extra', title: 'Something Else', skills: [{ name: 'Rust', status: 'used' }] },
    { id: 'empty', title: 'Empty', skills: [] },
  ],
}))

describe('SkillsSection', () => {
  it('shows one card per category and hides empty ones', () => {
    render(<SkillsSection />)

    expect(screen.getByRole('heading', { level: 2, name: 'Tools and technologies' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Frontend Development',
      'Backend Development',
      'Something Else',
    ])
  })

  it('shows the label and the short description on a card', () => {
    render(<SkillsSection />)

    expect(screen.getByText('Interface')).toBeInTheDocument()
    expect(screen.getByText('Building web interfaces.')).toBeInTheDocument()
  })

  it('lists the technologies of each category as badges', () => {
    render(<SkillsSection />)

    const frontend = screen.getByRole('list', { name: 'Frontend Development technologies' })
    expect(within(frontend).getByText('React')).toBeInTheDocument()
    expect(within(frontend).getByText('Tailwind CSS')).toBeInTheDocument()
    const backend = screen.getByRole('list', { name: 'Backend Development technologies' })
    expect(within(backend).getByText('REST API')).toBeInTheDocument()
  })

  it('draws an icon for every badge, a brand logo when there is one', () => {
    render(<SkillsSection />)

    const frontend = screen.getByRole('list', { name: 'Frontend Development technologies' })
    for (const item of within(frontend).getAllByRole('listitem')) {
      expect(item.querySelector('svg[aria-hidden="true"]')).not.toBeNull()
    }
    const react = within(frontend).getByText('React').closest('li')!
    expect(react.querySelector('svg.fill-current path')?.getAttribute('d')).toBeTruthy()
  })

  it('marks a skill being learned with visible text', () => {
    render(<SkillsSection />)

    const learning = screen.getAllByText('Learning')
    expect(learning).toHaveLength(1)
    expect(learning[0].closest('li')).toHaveTextContent('Go')
  })

  it('is a plain grid, with no carousel, counts, or pinned track', () => {
    const { container } = render(<SkillsSection />)

    expect(screen.queryByRole('region', { name: /skill categories/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /skills/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/\b\d+ skills?\b/)).not.toBeInTheDocument()
    expect(container.querySelector('.sticky')).toBeNull()
  })
})