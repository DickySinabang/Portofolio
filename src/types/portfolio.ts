export type NavItem = {
  label: string

  sectionId: string
}

export type SiteConfig = {
  brand: string
  closingMessage: string
}

export type Profile = {
  name: string
  title: string

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

  availability?: string
  headline: string
  intro: string
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

  photo?: {
    src: string
    alt: string
  }
}