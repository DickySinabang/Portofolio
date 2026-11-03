import type { AboutContent, ExperienceEntry, Profile } from '../types/portfolio'

export type PathNode = {
  id: string
  label: string
  title: string
  detail: string
}

type PathInput = {
  about: AboutContent
  experience: ExperienceEntry[]
  profile: Profile
}

export function buildPath({ about, experience, profile }: PathInput): PathNode[] {
  const nodes: PathNode[] = [
    {
      id: 'education',
      label: 'Education',
      title: about.education.degree,
      detail: about.education.institution,
    },
  ]

  for (const entry of experience) {
    nodes.push({
      id: `experience-${entry.id}`,
      label: entry.employmentType ?? 'Experience',
      title: entry.position,
      detail: entry.organization,
    })
  }

  nodes.push({
    id: 'now',
    label: 'Now',
    title: about.education.status,
    detail: profile.title,
  })

  return nodes
}
