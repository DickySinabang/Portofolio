import type { Profile, SocialLink } from '../types/portfolio'

function clean(value?: string): string {
  return value?.trim() ?? ''
}

/** Returns only the contact links that actually have a value. */
export function getSocialLinks(profile: Profile): SocialLink[] {
  const email = clean(profile.email)
  const github = clean(profile.githubUrl)
  const linkedin = clean(profile.linkedinUrl)
  const links: SocialLink[] = []

  if (email) {
    links.push({ id: 'email', label: 'Email', href: `mailto:${email}`, external: false })
  }
  if (github) {
    links.push({ id: 'github', label: 'GitHub', href: github, external: true })
  }
  if (linkedin) {
    links.push({ id: 'linkedin', label: 'LinkedIn', href: linkedin, external: true })
  }

  return links
}