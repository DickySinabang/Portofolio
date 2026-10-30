import type { AboutContent, ExperienceEntry, Profile } from '../types/portfolio'

export type PathNode = {
  id: string
  /** Short technical label, e.g. "Education". */
  label: string
  title: string
  detail: string
}

type PathInput = {
  about: AboutContent
  experience: ExperienceEntry[]
  profile: Profile
}

/**
 * Builds the "Path" strip from information that already exists in portfolio.ts:
 * education first, then each experience entry in the order it is listed, then
 * where things stand now. Nothing is invented, and no dates are shown here
 * (the Experience section carries those).
 */
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
