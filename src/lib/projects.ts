import type { Project, ProjectCategory } from '../types/portfolio'

export type ProjectFilterValue = ProjectCategory | 'all'

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  web: 'Web Development',
  backend: 'Backend',
  mobile: 'Mobile',
  iot: 'IoT',
  'machine-learning': 'Machine Learning',
}

/** Display order of the filter buttons. */
const categoryOrder: ProjectCategory[] = [
  'web',
  'backend',
  'mobile',
  'iot',
  'machine-learning',
]

/** Only categories that have at least one project are returned. */
export function getProjectCategories(projects: Project[]): ProjectCategory[] {
  return categoryOrder.filter((category) =>
    projects.some((project) => project.category === category),
  )
}

export function filterProjects(
  projects: Project[],
  filter: ProjectFilterValue,
): Project[] {
  if (filter === 'all') return projects
  return projects.filter((project) => project.category === filter)
}

/** Featured projects first; otherwise the order in portfolio.ts is kept. */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  )
}

export function findProjectBySlug(
  projects: Project[],
  slug: string | undefined,
): Project | undefined {
  if (!slug) return undefined
  return projects.find((project) => project.slug === slug)
}

/** Treats undefined and whitespace-only values as "no URL". */
export function cleanUrl(value?: string): string {
  return value?.trim() ?? ''
}