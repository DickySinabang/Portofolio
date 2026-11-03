import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SkillsSection } from './SkillsSection'

vi.mock('../../data/portfolio', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/portfolio')>()),
  skillCategories: [
    { id: 'frontend', title: 'Frontend', skills: [{ name: 'React', status: 'used' }] },
    {
      id: 'backend',
      title: 'Backend',
      skills: [
        { name: 'Laravel', status: 'used' },
        { name: 'REST API development', status: 'used' },
        { name: 'Go', status: 'learning' },
      ],
    },
  ],
}))

describe('SkillsSection', () => {
  it('shows every technology in one list under the section heading', () => {
    render(<SkillsSection />)

    expect(screen.getByRole('heading', { level: 2, name: 'Tools and technologies' })).toBeInTheDocument()
    const list = screen.getByRole('list', { name: 'Technologies' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(4)
    for (const label of ['React', 'Laravel', 'REST API', 'Go']) {
      expect(within(list).getByText(label)).toBeInTheDocument()
    }
  })

  it('draws an icon for every skill, a brand logo when there is one', () => {
    render(<SkillsSection />)

    const list = screen.getByRole('list', { name: 'Technologies' })
    for (const item of within(list).getAllByRole('listitem')) {
      expect(item.querySelector('svg[aria-hidden="true"]')).not.toBeNull()
    }
    const react = within(list).getByText('React').closest('li')!
    expect(react.querySelector('svg.fill-current path')?.getAttribute('d')).toBeTruthy()
  })

  it('has no skill counts, legend, or sideways controls', () => {
    const { container } = render(<SkillsSection />)

    expect(screen.queryByText(/\b\d+ skills?\b/)).not.toBeInTheDocument()
    expect(screen.queryByText(/dashed badges/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next skills' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /skill categories/i })).not.toBeInTheDocument()
    expect(container.querySelector('.sticky')).toBeNull()
  })

  it('marks a skill being learned with visible text', () => {
    render(<SkillsSection />)

    const learning = screen.getAllByText('Learning')
    expect(learning).toHaveLength(1)
    expect(learning[0].closest('li')).toHaveTextContent('Go')
  })
})