export type NavItem = {
  label: string
  /** The id of the matching <section> on the home page. */
  sectionId: string
}

export type SiteConfig = {
  brand: string
  /** Used as the default meta description. Keep it under about 160 characters. */
  description: string
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

export type HeroContent = {
  /** Short status label, e.g. "Open to opportunities". Leave empty to hide. */
  availability?: string
  /** One short tagline shown under the job title. */
  headline: string
}

export type Education = {
  degree: string
  institution: string
  status: string
}

export type AboutContent = {
  paragraphs: string[]
  education: Education
  interests: string[]
  approach: string[]
  /** Optional profile photo. Omit to hide the photo. */
  photo?: {
    src: string
    alt: string
  }
}

/** "used" = you have worked with it. "learning" = you are currently studying it. */
export type SkillStatus = 'used' | 'learning'

export type Skill = {
  name: string
  status: SkillStatus
}

export type SkillCategory = {
  /** Also selects the icon, see SkillsSection. */
  id: string
  title: string
  skills: Skill[]
}

export type ExperienceEntry = {
  id: string
  position: string
  organization: string
  location?: string
  employmentType?: string
  /** Free text, e.g. "Jul 2025". Leave out if unknown. */
  startDate?: string
  /** Free text, e.g. "Dec 2025" or "Present". Leave out if unknown. */
  endDate?: string
  description?: string
  responsibilities: string[]
  technologies: string[]
}

export type ProjectCategory =
  | 'web'
  | 'backend'
  | 'mobile'
  | 'iot'
  | 'machine-learning'

export type ProjectImage = {
  src: string
  alt: string
}

export type Project = {
  /** Unique, URL-safe name: lowercase letters, numbers, hyphens. Used as /projects/<slug>. */
  slug: string
  title: string
  /** One or two sentences, shown on the card. */
  description: string
  category: ProjectCategory
  technologies: string[]
  /** Featured projects are listed first. */
  featured?: boolean
  thumbnail?: ProjectImage

  // Everything below is optional and only shown on the detail page when present.
  overview?: string
  problem?: string
  objectives?: string[]
  features?: string[]
  /** Your specific contribution. */
  role?: string
  challenges?: string[]
  implementation?: string
  screenshots?: ProjectImage[]
  lessonsLearned?: string[]
  githubUrl?: string
  liveDemoUrl?: string
}

export type Highlight = {
  id: string
  title: string
  /** Describe what you actually did, factually. No invented results. */
  description: string
  /** Short label, e.g. "Academic project" or "Research". */
  kind?: string
  /** Free text, e.g. "2025". */
  period?: string
  url?: string
  urlLabel?: string
}

export type ContactContent = {
  heading: string
  message: string
}