import { ArrowUpRight } from 'lucide-react'
import { cleanUrl } from '../../lib/projects'
import type { Project } from '../../types/portfolio'

type ExternalLinkProps = {
  href: string
  label: string
  projectTitle: string
}

function ExternalLink({ href, label, projectTitle }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
    >
      {label}
      <ArrowUpRight aria-hidden="true" className="size-4" />
      <span className="sr-only">
        {' '}
        for {projectTitle} (opens in a new tab)
      </span>
    </a>
  )
}

/** Renders only the links that really exist. Renders nothing if there are none. */
export function ProjectLinks({ project }: { project: Project }) {
  const github = cleanUrl(project.githubUrl)
  const demo = cleanUrl(project.liveDemoUrl)

  if (!github && !demo) return null

  return (
    <>
      {github && (
        <ExternalLink href={github} label="GitHub" projectTitle={project.title} />
      )}
      {demo && (
        <ExternalLink href={demo} label="Live Demo" projectTitle={project.title} />
      )}
    </>
  )
}