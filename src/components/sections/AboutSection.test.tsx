import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AboutSection } from './AboutSection'

// Fixed test data, so these tests never depend on your real content.
const data = vi.hoisted(() => ({
  navItems: [
    { label: 'Home', sectionId: 'home' },
    { label: 'About', sectionId: 'about' },
  ],
  profile: { name: 'Ada Lovelace', title: 'Test Developer' },
  about: {
    paragraphs: ['The lead paragraph.', 'The second paragraph.'],
    education: { degree: 'BSc Test', institution: 'Test University', status: 'Graduate' },
    interests: ['Testing', 'Tooling'],
    approach: ['Read first.', 'Then build.'],
    photo: undefined as undefined | { src: string; alt: string },
  },
  experience: [
    {
      id: 'e1',
      position: 'Intern',
      organization: 'Test Corp',
      employmentType: 'Internship',
      responsibilities: [],
      technologies: [],
    },
  ],
}))

vi.mock('../../data/portfolio', () => data)

beforeEach(() => {
  data.about.paragraphs = ['The lead paragraph.', 'The second paragraph.']
  data.about.interests = ['Testing', 'Tooling']
  data.about.approach = ['Read first.', 'Then build.']
  data.about.photo = undefined
  data.experience.length = 1
})

describe('AboutSection', () => {
  it('keeps the section heading and shows the story', () => {
    render(<AboutSection />)

    expect(screen.getByRole('heading', { level: 2, name: 'A little about me' })).toBeInTheDocument()
    expect(screen.getByText('The lead paragraph.')).toBeInTheDocument()
    expect(screen.getByText('The second paragraph.')).toBeInTheDocument()
  })

  it('shows the profile panel with name, role, education, and university only', () => {
    render(<AboutSection />)

    const panel = within(screen.getByRole('heading', { level: 3, name: 'Profile' }).closest('div')!.parentElement!)
    expect(panel.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(panel.getByText('Test Developer')).toBeInTheDocument()
    expect(panel.getByText('BSc Test')).toBeInTheDocument()
    expect(panel.getByText('Test University')).toBeInTheDocument()
    expect(panel.getByText('Education')).toBeInTheDocument()
    expect(panel.getByText('University')).toBeInTheDocument()
    expect(panel.queryByText('Status')).not.toBeInTheDocument()
    expect(panel.queryByText('Graduate')).not.toBeInTheDocument()
  })

  it('shows a photo only when one is provided', () => {
    const { unmount } = render(<AboutSection />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    unmount()

    data.about.photo = { src: '/me.png', alt: 'A portrait' }
    render(<AboutSection />)
    expect(screen.getByRole('img', { name: 'A portrait' })).toHaveAttribute('src', '/me.png')
  })

    it('builds the career path from education, experience, and career', () => {
    render(<AboutSection />)

    const path = screen.getByRole('heading', { level: 3, name: 'Career Path' }).parentElement!
    expect(within(path).getAllByRole('listitem')).toHaveLength(3)
    expect(within(path).getByText('Internship')).toBeInTheDocument()
    expect(within(path).getByText('Test Corp')).toBeInTheDocument()
    expect(within(path).getByText('Career')).toBeInTheDocument()
  })

    it('no longer shows the interests or learning approach panels', () => {
    render(<AboutSection />)

    expect(screen.queryByRole('heading', { level: 3, name: 'Interests' })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: 'How I approach learning' }),
    ).not.toBeInTheDocument()
  })

  it('copes with a single paragraph', () => {
    data.about.paragraphs = ['Only one paragraph.']
    render(<AboutSection />)

    expect(screen.getByText('Only one paragraph.')).toBeInTheDocument()
  })
})
