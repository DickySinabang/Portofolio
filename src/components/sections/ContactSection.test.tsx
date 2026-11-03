import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactSection } from './ContactSection'

const data = vi.hoisted(() => ({
  profile: {
    name: 'Ada Lovelace',
    title: 'Test Developer',
    email: 'ada@example.com',
    githubUrl: '',
    linkedinUrl: '',
    cvUrl: '',
  },
  contact: { heading: 'Get in touch', message: 'Say hello.' },
}))

vi.mock('../../data/portfolio', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/portfolio')>()),
  ...data,
}))

beforeEach(() => {
  data.profile.email = 'ada@example.com'
})

function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
}

afterEach(() => {
  // Not vi.unstubAllGlobals(): that would also remove the shared test-setup stubs.
  Reflect.deleteProperty(navigator, 'clipboard')
})

describe('ContactSection', () => {
  it('shows the message, the email link, and the address as plain text', () => {
    render(<ContactSection />)

    expect(screen.getByRole('heading', { name: 'Get in touch' })).toBeInTheDocument()
    expect(screen.getByText('Say hello.')).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()
  })

  it('copies the email address and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    render(<ContactSection />)

    fireEvent.click(screen.getByRole('button', { name: /copy email/i }))

    await waitFor(() => expect(screen.getByText('Copied')).toBeInTheDocument())
    expect(writeText).toHaveBeenCalledWith('ada@example.com')
  })

  it('stays quiet when the clipboard is not available', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    stubClipboard(writeText)
    render(<ContactSection />)

    fireEvent.click(screen.getByRole('button', { name: /copy email/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalled())
    expect(screen.getByText('Copy email')).toBeInTheDocument()
  })

  it('renders nothing when there are no contact details', () => {
    data.profile.email = ''
    const { container } = render(<ContactSection />)

    expect(container).toBeEmptyDOMElement()
  })
})
