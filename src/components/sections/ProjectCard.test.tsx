import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { fullProject, minimalProject } from '../../test/fixtures'
import type { Project } from '../../types/portfolio'
import { ProjectCard } from './ProjectCard'

function renderCard(project: Project) {
  return render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>,
  )
}

describe('ProjectCard', () => {
  it('shows the key information and links to the detail page', () => {
    renderCard(fullProject)

    expect(screen.getByRole('heading', { level: 3, name: 'Full Project' })).toBeInTheDocument()
    expect(screen.getByText('Web Development')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'View Details, Full Project' })).toHaveAttribute(
      'href',
      '/projects/full-project',
    )
    expect(screen.getByRole('link', { name: /^GitHub/ })).toBeInTheDocument()
  })

  it('copes with a project that has only the required fields', () => {
    renderCard(minimalProject)

    expect(screen.getByRole('heading', { name: 'Minimal Project' })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Technologies' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument()
    expect(screen.getByText('Screenshot coming soon')).toBeInTheDocument()
  })

  it('falls back to the placeholder when the image fails to load', () => {
    renderCard({
      ...minimalProject,
      thumbnail: { src: '/images/missing.png', alt: 'Missing screenshot' },
    })

    const image = screen.getByRole('img', { name: 'Missing screenshot' })
    fireEvent.error(image)

    expect(screen.queryByRole('img', { name: 'Missing screenshot' })).not.toBeInTheDocument()
    expect(screen.getByText('Screenshot coming soon')).toBeInTheDocument()
  })
})