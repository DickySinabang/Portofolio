import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { fullProject, minimalProject } from '../../test/fixtures'
import { ProjectLinks } from './ProjectLinks'

describe('ProjectLinks', () => {
  it('renders safe external links that open in a new tab', () => {
    render(<ProjectLinks project={fullProject} />)

    const github = screen.getByRole('link', { name: /^GitHub, Full Project/ })
    expect(github).toHaveAttribute('href', 'https://github.com/DickySinabang/Portofolio')
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', 'noopener noreferrer')

    const demo = screen.getByRole('link', { name: /^Live Demo, Full Project/ })
    expect(demo).toHaveAttribute('href', 'https://full-project.example.com')
    expect(demo).toHaveAttribute('target', '_blank')
    expect(demo).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders only the links that exist', () => {
    render(<ProjectLinks project={{ ...minimalProject, githubUrl: 'https://github.com/x/y' }} />)

    expect(screen.getByRole('link', { name: /GitHub/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Live Demo/ })).not.toBeInTheDocument()
  })

  it('renders nothing when there are no links or only blank ones', () => {
    const { container } = render(
      <ProjectLinks project={{ ...minimalProject, githubUrl: '   ', liveDemoUrl: '' }} />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})