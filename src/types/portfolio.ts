export type NavItem = {
  label: string
  /** The id of the matching <section> on the home page. */
  sectionId: string
}

export type SiteConfig = {
  brand: string
  closingMessage: string
}

export type Profile = {
  name: string
  title: string
  /** Contact fields are optional: anything left empty is simply not shown. */
  email?: string
  githubUrl?: string
  linkedinUrl?: string
  cvUrl?: string
}

export type SocialLink = {
  id: 'email' | 'github' | 'linkedin'
  label: string
  href: string
  external: boolean
}