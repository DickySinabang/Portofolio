import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroSection } from './HeroSection'

// Fixed test data, so these tests never depend on your real content.
const data = vi.hoisted(() => ({
  profile: {
    name: 'Ada Lovelace',
    title: 'Test Developer',
    email: '',
    githubUrl: '',
    linkedinUrl: '',
    cvUrl: '',
  },
  hero: { availability: '', headline: 'A test tagline.', intro: 'A test introduction.' },
  about: {
    paragraphs: [],
    education: { degree: 'BSc', institution: 'Test University', status: 'Graduate' },
    interests: ['Testing'],
    approach: [],
  },
  skillCategories: [
    { id: 'frontend', title: 'Frontend', skills: [{ name: 'React', status: 'used' }] },
  ],
}))

vi.mock('../../data/portfolio', () => data)
// The star field draws on a <canvas>, which jsdom cannot do.
vi.mock('./ParticleField', () => ({ ParticleField: () => null }))

function renderHero() {
  return render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  data.profile.name = 'Ada Lovelace'
  data.profile.email = ''
  data.profile.githubUrl = ''
  data.profile.linkedinUrl = ''
  data.profile.cvUrl = ''
  data.hero.availability = ''
})

describe('HeroSection', () => {
  it('shows the name as the single h1, with the role and tagline', () => {
    renderHero()

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Ada Lovelace')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByText('Test Developer')).toBeInTheDocument()
    expect(screen.getByText('A test tagline.')).toBeInTheDocument()
  })

  it('always offers a link to the projects', () => {
    renderHero()

    expect(screen.getByRole('link', { name: 'View My Projects' })).toHaveAttribute(
      'href',
      '/#projects',
    )
  })

  it('hides every optional element when its data is missing', () => {
    renderHero()

    expect(screen.queryByRole('link', { name: 'Contact Me' })).not.toBeInTheDocument()
    expect(screen.queryByText('Open to opportunities')).not.toBeInTheDocument()
  })

  it('shows contact and availability when they exist, but never the CV', () => {
    data.profile.email = 'ada@example.com'
    data.profile.cvUrl = '/cv/ada.pdf'
    data.hero.availability = 'Open to opportunities'
    renderHero()

    expect(screen.getByRole('link', { name: 'Contact Me' })).toHaveAttribute('href', '/#contact')
    expect(screen.getByText('Open to opportunities')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Download CV/ })).not.toBeInTheDocument()
  })

  it('offers exactly two buttons, and no social links or intro label', () => {
    data.profile.email = 'ada@example.com'
    data.profile.githubUrl = 'https://github.com/ada'
    data.profile.linkedinUrl = 'https://www.linkedin.com/in/ada'
    data.profile.cvUrl = '/cv/ada.pdf'
    const { container } = renderHero()

    expect(screen.getAllByRole('link').map((link) => link.textContent?.trim())).toEqual([
      'View My Projects',
      'Contact Me',
    ])
    expect(screen.queryByRole('link', { name: /GitHub|LinkedIn/ })).not.toBeInTheDocument()
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(container).not.toHaveTextContent('Intro')
  })

  it('no longer shows the developer.ts code card', () => {
    const { container } = renderHero()

    expect(container).not.toHaveTextContent('developer.ts')
  })

  it('copes with a single-word name', () => {
    data.profile.name = 'Cher'
    renderHero()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Cher')
  })
})
