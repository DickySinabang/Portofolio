import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ExperienceSection } from './ExperienceSection'

// Fixed test data, so these tests never depend on your real content.
const data = vi.hoisted(() => ({
  experience: [
    {
      id: 'e1',
      position: 'Developer Intern',
      organization: 'Test Corp',
      employmentType: 'Internship',
      location: 'Bogor',
      startDate: 'Jan 2025',
      endDate: 'Jun 2025',
      description: 'A short summary of the work.',
      responsibilities: ['Wrote code', 'Fixed bugs'],
      technologies: ['PHP', 'MySQL'],
    },
  ],
}))

vi.mock('../../data/portfolio', () => data)

const original = structuredClone(data.experience)

beforeEach(() => {
  data.experience.length = 0
  data.experience.push(...structuredClone(original))
})

describe('ExperienceSection', () => {
  it('shows the position, company, location, and period', () => {
    render(<ExperienceSection />)

    expect(screen.getByRole('heading', { level: 2, name: "Where I've worked" })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Developer Intern' })).toBeInTheDocument()
    expect(screen.getByText('Test Corp')).toBeInTheDocument()
    expect(screen.getByText('Bogor')).toBeInTheDocument()
    expect(screen.getByText('Jan 2025 – Jun 2025')).toBeInTheDocument()
    expect(screen.getByText('Internship')).toBeInTheDocument()
  })

  it('shows a short description and the technology badges', () => {
    render(<ExperienceSection />)

    expect(screen.getByText('A short summary of the work.')).toBeInTheDocument()
    const badges = screen.getByRole('list', { name: 'Technologies used' })
    expect(within(badges).getByText('PHP')).toBeInTheDocument()
    expect(within(badges).getByText('MySQL')).toBeInTheDocument()
  })

  it('shows at most two bullets per position', () => {
    data.experience[0].responsibilities = ['Wrote code', 'Fixed bugs', 'Reviewed pull requests']
    render(<ExperienceSection />)

    expect(screen.getByText('Wrote code')).toBeInTheDocument()
    expect(screen.getByText('Fixed bugs')).toBeInTheDocument()
    expect(screen.queryByText('Reviewed pull requests')).not.toBeInTheDocument()
  })

  it('gives every position its own heading', () => {
    data.experience.push({ ...structuredClone(original[0]), id: 'e2', position: 'Junior Developer' })
    render(<ExperienceSection />)

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2)
  })

  it('hides optional parts when their data is missing', () => {
    Object.assign(data.experience[0], {
      employmentType: undefined,
      location: undefined,
      description: '',
      responsibilities: [],
      technologies: [],
    })
    render(<ExperienceSection />)

    expect(screen.queryByText('Internship')).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Technologies used' })).not.toBeInTheDocument()
  })

  it('renders nothing when there is no experience', () => {
    data.experience.length = 0
    const { container } = render(<ExperienceSection />)

    expect(container).toBeEmptyDOMElement()
  })
})