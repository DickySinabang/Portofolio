import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { backendProject, fullProject, minimalProject } from '../../test/fixtures'
import type { Project } from '../../types/portfolio'
import { ProjectsSection } from './ProjectsSection'

function renderSection(items: Project[]) {
  return render(
    <MemoryRouter>
      <ProjectsSection items={items} />
    </MemoryRouter>,
  )
}

function projectTitles() {
  return screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
}

describe('ProjectsSection', () => {
  it('shows an honest empty state when there are no projects', () => {
    renderSection([])

    expect(
      screen.getByText('Projects are being added. Please check back soon.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('lists featured projects first', () => {
    renderSection([fullProject, minimalProject, backendProject])

    expect(projectTitles()).toEqual(['API Project', 'Full Project', 'Minimal Project'])
  })

  it('offers filters only for categories that have projects', () => {
    renderSection([fullProject, minimalProject, backendProject])

    const filters = within(screen.getByRole('group', { name: 'Filter projects by category' }))
    expect(filters.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(filters.getByRole('button', { name: 'Web Development' })).toBeInTheDocument()
    expect(filters.getByRole('button', { name: 'Backend' })).toBeInTheDocument()
    expect(filters.getByRole('button', { name: 'IoT' })).toBeInTheDocument()
    expect(filters.queryByRole('button', { name: 'Mobile' })).not.toBeInTheDocument()
    expect(filters.queryByRole('button', { name: 'Machine Learning' })).not.toBeInTheDocument()
  })

  it('hides the filter bar when there is only one category', () => {
    renderSection([fullProject])

    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('filters the projects when a category is chosen', async () => {
    const user = userEvent.setup()
    renderSection([fullProject, minimalProject, backendProject])

    await user.click(screen.getByRole('button', { name: 'IoT' }))

    expect(projectTitles()).toEqual(['Minimal Project'])
    expect(screen.getByRole('button', { name: 'IoT' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Showing 1 project')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(projectTitles()).toHaveLength(3)
    expect(screen.getByText('Showing 3 projects')).toBeInTheDocument()
  })
})