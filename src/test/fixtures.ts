import type {
  AboutContent,
  ExperienceEntry,
  Profile,
  Project,
  SiteConfig,
  SkillCategory,
} from '../types/portfolio'

export const testProfile: Profile = {
  name: 'Test Person',
  title: 'Test Developer',
  email: 'test@example.com',
  githubUrl: 'https://github.com/DickySinabang/Portofolio',
  linkedinUrl: '',
  cvUrl: '',
}

export const testSite: SiteConfig = {
  brand: 'TestBrand',
  description: 'Test description.',
  closingMessage: 'Bye.',
}

export const testAbout: AboutContent = {
  paragraphs: ['Paragraph one.'],
  education: { degree: 'BSc Test', institution: 'Test University', status: 'Graduate' },
  interests: ['Testing'],
  approach: ['Test first.'],
}

export const testSkillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    skills: [
      { name: 'React', status: 'used' },
      { name: 'Vue', status: 'learning' },
    ],
  },
  { id: 'backend', title: 'Backend', skills: [] },
]

export const testExperience: ExperienceEntry[] = [
  {
    id: 'e1',
    position: 'Intern',
    organization: 'Test Corp',
    startDate: 'Jan 2025',
    endDate: 'Jun 2025',
    description: 'Built things.',
    responsibilities: ['Did work.'],
    technologies: [],
  },
]

/** A project with every optional field filled in. */
export const fullProject: Project = {
  slug: 'full-project',
  title: 'Full Project',
  description: 'A project with every field filled in.',
  category: 'web',
  technologies: ['React', 'TypeScript'],
  overview: 'Overview text.',
  problem: 'Problem text.',
  objectives: ['Objective one'],
  features: ['Feature one'],
  role: 'Role text.',
  implementation: 'Implementation text.',
  challenges: ['Challenge one'],
  screenshots: [{ src: '/images/shot.png', alt: 'Full project dashboard' }],
  lessonsLearned: ['Lesson one'],
  githubUrl: 'https://github.com/DickySinabang/Portofolio',
  liveDemoUrl: 'https://full-project.example.com',
}

/** A project with ONLY the required fields. */
export const minimalProject: Project = {
  slug: 'minimal-project',
  title: 'Minimal Project',
  description: 'Only the required fields.',
  category: 'iot',
  technologies: [],
}

export const backendProject: Project = {
  slug: 'api-project',
  title: 'API Project',
  description: 'A backend project.',
  category: 'backend',
  technologies: ['Laravel'],
  featured: true,
}