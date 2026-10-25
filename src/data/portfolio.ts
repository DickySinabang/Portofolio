import type { NavItem, Profile, SiteConfig } from '../types/portfolio'

export const site: SiteConfig = {
  brand: 'DevPortfolio', // temporary brand name
  closingMessage: 'Thanks for stopping by.',
}

export const profile: Profile = {
  name: 'Your Name', // TODO: replace with your full name
  title: 'Aspiring Full-Stack / Web Developer',
  // Fill these in ONLY with details you want to be public.
  // Empty values are hidden everywhere on the site.
  email: '',
  githubUrl: '',
  linkedinUrl: '',
  cvUrl: '',
}

export const navItems: NavItem[] = [
  { label: 'Home', sectionId: 'home' },
  { label: 'About', sectionId: 'about' },
  { label: 'Skills', sectionId: 'skills' },
  { label: 'Experience', sectionId: 'experience' },
  { label: 'Projects', sectionId: 'projects' },
  { label: 'Contact', sectionId: 'contact' },
]