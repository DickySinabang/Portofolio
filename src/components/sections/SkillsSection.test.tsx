import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
        { name: 'Go', status: 'learning' },
      ],
    },
  ],
}))

describe('SkillsSection', () => {
  it('lists every category as a module on a keyboard-scrollable rail', () => {
    render(<SkillsSection />)

    const rail = screen.getByRole('region', { name: /skill categories/i })
    expect(rail).toHaveAttribute('tabindex', '0')
    expect(within(rail).getByRole('heading', { name: 'Frontend' })).toBeInTheDocument()
    expect(within(rail).getByRole('heading', { name: 'Backend' })).toBeInTheDocument()
    expect(within(rail).getByText('2 skills')).toBeInTheDocument()
    expect(within(rail).getByText('1 skill')).toBeInTheDocument()
  })

  it('marks skills being learned with visible text, and explains the badges', () => {
    render(<SkillsSection />)

    expect(screen.getByText('Learning')).toBeInTheDocument()
    expect(screen.getByText(/dashed badges/i)).toBeInTheDocument()
  })

  it('offers previous and next buttons, with previous disabled at the start', () => {
    render(<SkillsSection />)

    expect(screen.getByRole('button', { name: 'Previous skills' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next skills' })).toBeInTheDocument()
  })
})

describe('SkillsSection on a wide screen', () => {
  const realMatchMedia = window.matchMedia

  afterEach(() => {
    window.matchMedia = realMatchMedia
  })

  function stubWideScreen() {
    window.matchMedia = ((query: string) => ({
      matches: !query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia
  }

  it('pins: a tall section holds a sticky viewport, and the cards need no clicking', () => {
    stubWideScreen()
    const { container } = render(<SkillsSection />)

    const section = container.querySelector('section#skills') as HTMLElement
    expect(section.style.height).toContain('100svh')
    expect(container.querySelector('.sticky')).not.toBeNull()
    expect(screen.getByRole('region', { name: /slide sideways as you scroll/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Tools and technologies' })).toBeInTheDocument()
    // The arrows are only extras; there is nothing to scroll yet, so Previous starts disabled.
    expect(screen.getByRole('button', { name: 'Previous skills' })).toBeDisabled()
  })

  it('does not pin when the visitor prefers reduced motion', () => {
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia
    const { container } = render(<SkillsSection />)

    expect(container.querySelector('.sticky')).toBeNull()
    expect(screen.getByRole('region', { name: /scrolls sideways/i })).toHaveAttribute('tabindex', '0')
  })
})
