import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ExperienceSection } from './ExperienceSection'

const data = vi.hoisted(() => ({
  experience: [
    {
      id: 'one',
      position: 'Developer Intern',
      organization: 'Test Co',
      employmentType: 'Internship',
      location: 'Bandung',
      startDate: '2024-01',
      endDate: '2024-06',
      description: 'Built things.',
      responsibilities: ['Wrote code', 'Fixed bugs'],
      technologies: ['React', 'Laravel'],
    },
  ],
}))

vi.mock('../../data/portfolio', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/portfolio')>()),
  ...data,
}))

describe('ExperienceSection', () => {
  it('lists each position with its details', () => {
    render(<ExperienceSection />)

    const entry = screen.getByRole('heading', { name: 'Developer Intern' }).closest('li')!
    expect(within(entry).getByRole('heading', { name: 'Developer Intern' })).toBeInTheDocument()
    expect(within(entry).getByText(/Test Co/)).toBeInTheDocument()
    expect(within(entry).getByText('Built things.')).toBeInTheDocument()
    expect(within(entry).getByText('Wrote code')).toBeInTheDocument()
    expect(within(entry).getByRole('list', { name: 'Technologies used' })).toBeInTheDocument()
  })

  it('renders nothing when there is no experience', () => {
    data.experience.length = 0 // the mocked module shares this same array
    const { container } = render(<ExperienceSection />)

    expect(container).toBeEmptyDOMElement()
  })

    it('shows at most two bullets per position', () => {
    data.experience[0].responsibilities = ['Wrote code', 'Fixed bugs', 'Reviewed pull requests']
    render(<ExperienceSection />)

    const entry = screen.getByRole('heading', { name: 'Developer Intern' }).closest('li')!
    expect(within(entry).getByText('Wrote code')).toBeInTheDocument()
    expect(within(entry).getByText('Fixed bugs')).toBeInTheDocument()
    expect(within(entry).queryByText('Reviewed pull requests')).not.toBeInTheDocument()
  })
})
