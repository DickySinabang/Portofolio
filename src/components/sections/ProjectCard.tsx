import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { projectCategoryLabels } from '../../lib/projects'
import type { Project } from '../../types/portfolio'
import { Badge } from '../ui/Badge'
import { SpotlightCard } from '../ui/SpotlightCard'
import { ProjectLinks } from './ProjectLinks'
import { ProjectThumbnail } from './ProjectThumbnail'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard as="article" className="h-full">
      <ProjectThumbnail image={project.thumbnail} category={project.category} />

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs text-accent">
          {projectCategoryLabels[project.category]}
        </p>
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