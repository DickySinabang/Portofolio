import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { projectCategoryLabels } from '../../lib/projects'
import type { Project } from '../../types/portfolio'
import { Badge } from '../ui/Badge'
import { SpotlightCard } from '../ui/SpotlightCard'
import { ProjectLinks } from './ProjectLinks'
import { ProjectThumbnail } from './ProjectThumbnail'

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  return (
    <SpotlightCard as="article" className="h-full">
      <ProjectThumbnail image={project.thumbnail} category={project.category} />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 font-mono text-xs">
          <p className="inline-flex items-center gap-2 text-accent">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent-3 shadow-[0_0_0.5rem_var(--accent-3)]"
            />
            {projectCategoryLabels[project.category]}
          </p>
          {index !== undefined && (
            <span aria-hidden="true" className="text-muted">
              MISSION {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>

        {project.technologies.length > 0 && (
          <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            View Details
            <ArrowRight aria-hidden="true" className="size-4" />
            <span className="sr-only">, {project.title}</span>
          </Link>
          <ProjectLinks project={project} />
        </div>
      </div>
    </SpotlightCard>
  )
}