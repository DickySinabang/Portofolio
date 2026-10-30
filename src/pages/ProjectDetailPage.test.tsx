import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ProjectDetailPage } from './ProjectDetailPage'

// Feed the page fixed test data instead of your real portfolio data.
vi.mock('../data/portfolio', async () => {
  const fixtures = await import('../test/fixtures')
  return {
    profile: fixtures.testProfile,
    site: fixtures.testSite,
    projects: [fixtures.fullProject, fixtures.minimalProject],
  }
})

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProjectDetailPage', () => {
  it('renders every section of a fully described project', () => {
    renderAt('/projects/full-project')

    expect(screen.getByRole('heading', { level: 1, name: 'Full Project' })).toBeInTheDocument()
    for (const title of [
      'Overview',
      'The problem',
      'Objectives',
      'Key features',
      'My contribution',
      'Implementation approach',
      'Challenges',
      'Screenshots',
      'Lessons learned',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument()
    }

    expect(screen.getByRole('img', { name: 'Full project dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^GitHub/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Live Demo/ })).toBeInTheDocument()
    expect(document.title).toBe('Full Project | Test Person')
  })

  it('omits sections and links when optional fields are missing', () => {
    renderAt('/projects/minimal-project')

    expect(screen.getByRole('heading', { level: 1, name: 'Minimal Project' })).toBeInTheDocument()
    expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Live Demo/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Technology stack' })).not.toBeInTheDocument()
  })

  it('offers a way back to the projects list', () => {
    renderAt('/projects/full-project')

    const backLinks = screen.getAllByRole('link', { name: 'Back to projects' })
    expect(backLinks).toHaveLength(2)
    expect(backLinks[0]).toHaveAttribute('href', '/#projects')
  })

  it('shows a friendly "not found" state for an unknown project', () => {
    const { unmount } = renderAt('/projects/does-not-exist')

    expect(screen.getByRole('heading', { level: 1, name: 'Project not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to projects' })).toBeInTheDocument()
    expect(document.title).toBe('Project not found | TestBrand')
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex',
    )

    // The noindex tag must not leak onto other pages.
    unmount()
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })
})