import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactSection } from './ContactSection'

const data = vi.hoisted(() => ({
  profile: {
    name: 'Ada Lovelace',
    title: 'Test Developer',
    email: 'ada@example.com',
    githubUrl: 'https://github.com/ada',
    linkedinUrl: 'https://www.linkedin.com/in/ada',
    cvUrl: '/cv/ada.pdf',
  },
  contact: { heading: 'Get in touch', message: 'Say hello.' },
}))

vi.mock('../../data/portfolio', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/portfolio')>()),
  ...data,
}))

beforeEach(() => {
  data.profile.email = 'ada@example.com'
  data.profile.githubUrl = 'https://github.com/ada'
  data.profile.linkedinUrl = 'https://www.linkedin.com/in/ada'
  data.profile.cvUrl = '/cv/ada.pdf'
})

describe('ContactSection', () => {
  it('shows the heading and the message', () => {
    render(<ContactSection />)

    expect(screen.getByRole('heading', { name: 'Get in touch' })).toBeInTheDocument()
    expect(screen.getByText('Say hello.')).toBeInTheDocument()
  })

  it('offers the Email, GitHub, LinkedIn, and Download CV buttons', () => {
    render(<ContactSection />)

    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:ada@example.com')
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/ada')
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/ada',
    )
    const cv = screen.getByRole('link', { name: /Download CV/ })
    expect(cv).toHaveAttribute('href', '/cv/ada.pdf')
    expect(cv).toHaveAttribute('download')
  })

  it('does not repeat the email address as text', () => {
    render(<ContactSection />)

    expect(screen.queryByText('ada@example.com')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /copy email/i })).not.toBeInTheDocument()
  })

  it('renders nothing when there are no contact details', () => {
    data.profile.email = ''
    data.profile.githubUrl = ''
    data.profile.linkedinUrl = ''
    data.profile.cvUrl = ''
    const { container } = render(<ContactSection />)

    expect(container).toBeEmptyDOMElement()
  })
})