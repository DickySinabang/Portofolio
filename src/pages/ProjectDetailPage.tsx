import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { ProjectLinks } from '../components/sections/ProjectLinks'
import { Badge } from '../components/ui/Badge'
import { BulletList } from '../components/ui/BulletList'
import { Container } from '../components/ui/Container'
import { projects } from '../data/portfolio'
import { findProjectBySlug, projectCategoryLabels } from '../lib/projects'

function BackLink() {
  return (
    <Link
      to="/#projects"
      className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      Back to projects
    </Link>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = findProjectBySlug(projects, slug)

  if (!project) {
    return (
      <Container className="py-24">
        <BackLink />
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">Project not found</h1>
        <p className="mt-4 max-w-md text-muted">
          This project doesn't exist or may have been removed.
        </p>
      </Container>
    )
  }

  const hasLinks = Boolean(project.githubUrl?.trim() || project.liveDemoUrl?.trim())

  return (
    <Container className="py-16 sm:py-20">
      <BackLink />

      <header className="mt-8 max-w-3xl">
        <p className="font-mono text-sm text-accent">
          {projectCategoryLabels[project.category]}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{project.description}</p>

        {hasLinks && (
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <ProjectLinks project={project} />
          </div>
        )}

        {project.technologies.length > 0 && (
          <ul aria-label="Technology stack" className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="mt-12 max-w-3xl space-y-10">
        {project.overview && (
          <Block title="Overview">
            <p className="leading-relaxed text-muted">{project.overview}</p>
          </Block>
        )}

        {project.problem && (
          <Block title="The problem">
            <p className="leading-relaxed text-muted">{project.problem}</p>
          </Block>
        )}

        {project.objectives && project.objectives.length > 0 && (
          <Block title="Objectives">
            <BulletList items={project.objectives} />
          </Block>
        )}

        {project.features && project.features.length > 0 && (
          <Block title="Key features">
            <BulletList items={project.features} />
          </Block>
        )}

        {project.role && (
          <Block title="My contribution">
            <p className="leading-relaxed text-muted">{project.role}</p>
          </Block>
        )}

        {project.implementation && (
          <Block title="Implementation approach">
            <p className="leading-relaxed text-muted">{project.implementation}</p>
          </Block>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <Block title="Challenges">
            <BulletList items={project.challenges} />
          </Block>
        )}

        {project.screenshots && project.screenshots.length > 0 && (
          <Block title="Screenshots">
            <div className="grid gap-4 sm:grid-cols-2">
              {project.screenshots.map((shot) => (
                <img
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  className="w-full rounded-lg border border-line"
                />
              ))}
            </div>
          </Block>
        )}

        {project.lessonsLearned && project.lessonsLearned.length > 0 && (
          <Block title="Lessons learned">
            <BulletList items={project.lessonsLearned} />
          </Block>
        )}
      </div>

      <div className="mt-16 border-t border-line pt-8">
        <BackLink />
      </div>
    </Container>
  )
}