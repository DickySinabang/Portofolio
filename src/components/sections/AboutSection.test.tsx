import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AboutSection } from './AboutSection'

// Fixed test data, so these tests never depend on your real content.
const data = vi.hoisted(() => ({
  profile: { name: 'Ada Lovelace', title: 'Test Developer' },
  about: {
    headline: ['Turning ideas', 'into reality.'] as [string, string] | undefined,
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
  data.about.headline = ['Turning ideas', 'into reality.']
  data.about.paragraphs = ['The lead paragraph.', 'The second paragraph.']
  data.about.photo = undefined
  data.experience.length = 1
})

describe('AboutSection', () => {
  it('uses the headline as the section heading', () => {
    render(<AboutSection />)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Turning ideas into reality.')
    expect(screen.getByRole('region', { name: /Turning ideas/ })).toHaveAttribute('id', 'about')
  })

  it('falls back to a plain heading when no headline is set', () => {
    data.about.headline = undefined
    render(<AboutSection />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A little about me')
  })

  it('shows the name, role, a short description, and the education line', () => {
    render(<AboutSection />)

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Test Developer')).toBeInTheDocument()
    expect(screen.getByText('The lead paragraph.')).toBeInTheDocument()
    expect(screen.getByText('BSc Test · Test University')).toBeInTheDocument()
    expect(screen.queryByText('The second paragraph.')).not.toBeInTheDocument()
  })

  it('shows a large portrait when there is a photo', () => {
    data.about.photo = { src: '/images/profile.jpeg', alt: 'Ada portrait' }
    render(<AboutSection />)

    expect(screen.getByRole('img', { name: 'Ada portrait' })).toHaveAttribute(
      'src',
      '/images/profile.jpeg',
    )
  })

  it('shows no photo when none is set', () => {
    render(<AboutSection />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('has no profile card and no statistics', () => {
    const { container } = render(<AboutSection />)

    expect(screen.queryByRole('heading', { level: 3, name: 'Profile' })).not.toBeInTheDocument()
    expect(container).not.toHaveTextContent(/\d+\+/)
  })

  it('keeps the career path timeline under the introduction', () => {
    render(<AboutSection />)

    const path = screen.getByRole('heading', { level: 3, name: 'Career Path' }).parentElement!
    expect(within(path).getAllByRole('listitem')).toHaveLength(3)
    expect(within(path).getByText('Test Corp')).toBeInTheDocument()
  })

  it('does not show the interests or learning approach', () => {
    render(<AboutSection />)

    expect(screen.queryByText('Interests')).not.toBeInTheDocument()
    expect(screen.queryByText('How I approach learning')).not.toBeInTheDocument()
  })
})