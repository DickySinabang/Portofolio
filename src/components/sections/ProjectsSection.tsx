import { useMemo, useState } from 'react'
import { projects as portfolioProjects } from '../../data/portfolio'
import {
  filterProjects,
  getProjectCategories,
  sortProjects,
  type ProjectFilterValue,
} from '../../lib/projects'
import type { Project } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { ProjectCard } from './ProjectCard'
import { ProjectFilter } from './ProjectFilter'

type ProjectsSectionProps = {
  /** Defaults to the data in portfolio.ts. Tests pass their own. */
  items?: Project[]
}

export function ProjectsSection({ items = portfolioProjects }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<ProjectFilterValue>('all')
  const sortedProjects = useMemo(() => sortProjects(items), [items])
  const categories = useMemo(() => getProjectCategories(sortedProjects), [sortedProjects])
  const visibleProjects = filterProjects(sortedProjects, filter)

  return (
    <Section id="projects" eyebrow="Projects" title="Selected projects">
      {sortedProjects.length === 0 ? (
        <p className="max-w-xl rounded-lg border border-dashed border-line p-6 text-muted">
          Projects are being added. Please check back soon.
        </p>
      ) : (
        <>
          {categories.length > 1 && (
            <div className="mb-8">
              <ProjectFilter categories={categories} active={filter} onChange={setFilter} />
            </div>
          )}

          {/* Announces the result count to screen readers when a filter changes. */}
          <p aria-live="polite" className="sr-only">
            Showing {visibleProjects.length}{' '}
            {visibleProjects.length === 1 ? 'project' : 'projects'}
          </p>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project, index) => (
              <li key={project.slug} className="flex">
                <Reveal className="h-full w-full" delay={(index % 3) * 80}>
                  <ProjectCard project={project} index={index} />
                </Reveal>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  )
}