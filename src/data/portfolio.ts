import { getVisibleSkillCategories } from '../lib/skills'
import { hasContactDetails } from '../lib/socialLinks'
import type {
  AboutContent,
  ContactContent,
  ExperienceEntry,
  Highlight,
  HeroContent,
  NavItem,
  Profile,
  Project,
  SiteConfig,
  SkillCategory,
} from '../types/portfolio'

export const site: SiteConfig = {
  brand: 'DevPortfolio', // temporary brand name
  description:
    'Portfolio of an Information Technology graduate and aspiring full-stack web developer: projects, skills, and experience.',
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

export const hero: HeroContent = {
  // Only fill this in if it is accurate, e.g. "Open to opportunities".
  availability: '',
  headline: 'Building Thoughtful Digital Experiences.',
  intro:
    "I'm an Information Technology graduate interested in building practical web applications and exploring technologies that solve real-world problems.",
}

export const about: AboutContent = {
  paragraphs: [
    "I recently graduated with a Bachelor's degree in Information Technology from Telkom University. My interests center on full-stack and back-end web development, with a growing curiosity about mobile applications, the Internet of Things, and machine learning.",
    'As a Full-Stack Developer Intern at PT Karya Multi Solution Indonesia, I worked on an IoT-based smart building monitoring project. My work used web technologies and databases to support monitoring and dashboard features, and included sensor integration activities.',
  ],
  education: {
    degree: "Bachelor's Degree in Information Technology",
    institution: 'Telkom University',
    status: 'Fresh graduate',
  },
  interests: [
    'Full-Stack Web Development',
    'Back-End Development',
    'Mobile Application Development',
    'Internet of Things (IoT)',
    'Machine Learning',
  ],
  // TODO: DRAFT. Rewrite these so they describe how YOU actually work.
  approach: [
    'Start by understanding the problem, then choose the tools.',
    'Build small working pieces first, then improve them.',
    'Read documentation and error messages carefully before changing code.',
  ],
  // To show a photo, put a file in public/images/ and uncomment:
  // photo: { src: '/images/profile.jpg', alt: 'Portrait of Your Name' },
}

/**
 * HOW TO FILL THIS IN
 * Uncomment ONLY the skills you have really used or are really learning,
 * and be ready to talk about each one in an interview.
 *   status: 'used'     -> you have worked with it
 *   status: 'learning' -> you are currently studying it
 * Categories with no active skills are hidden automatically.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    skills: [
      { name: 'React', status: 'used' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    skills: [
      { name: 'Laravel', status: 'used' },
      { name: 'REST API development', status: 'used' },
    ],
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    skills: [
      { name: 'PHP', status: 'used' },
      { name: 'JavaScript', status: 'used' },
      { name: 'TypeScript', status: 'used' },
      { name: 'Python', status: 'used' },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    skills: [
      { name: 'MySQL', status: 'used' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    skills: [
      { name: 'Flutter', status: 'used' },
    ],
  },
  {
    id: 'iot-ml',
    title: 'IoT and Machine Learning',
    skills: [
      { name: 'IoT sensor integration', status: 'used' },
      { name: 'Machine learning (basics)', status: 'learning' },
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    skills: [
      { name: 'Git', status: 'used' },
      { name: 'GitHub', status: 'used' },
    ],
  },
]

export const experience: ExperienceEntry[] = [
  {
    id: 'karya-multi-solution-intern',
    position: 'Full-Stack Developer Intern',
    organization: 'PT Karya Multi Solution Indonesia',
    employmentType: 'Internship',
    // TODO: add these only when you know the exact values.
    location: '...',
    startDate: '...',
    endDate: '...',
    description: 'Worked on an IoT-based smart building monitoring project.',
    responsibilities: [
      'Used web technologies and databases to support monitoring and dashboard functionality.',
      'Participated in IoT development and sensor integration activities.',
    ],
    // TODO: list the exact technologies you used there, for example ['Laravel', 'MySQL'].
    technologies: [],
  },
]

/**
 * HOW TO ADD A PROJECT
 * 1. Copy the template below, remove the // markers, and fill in REAL information.
 * 2. Delete any optional line you have no real answer for.
 * 3. Screenshots: put image files in public/images/projects/ and reference them
 *    as '/images/projects/your-file.png'. Without images a placeholder is shown.
 * 4. Only add githubUrl / liveDemoUrl if the link really works.
 *
 * category must be one of: 'web' | 'backend' | 'mobile' | 'iot' | 'machine-learning'
 */
export const projects: Project[] = [
  // {
  //   slug: 'my-project-name',
  //   title: '[PROJECT NAME]',
  //   description: '[ONE OR TWO SENTENCES ABOUT THE PROJECT]',
  //   category: 'web',
  //   technologies: ['[TECHNOLOGY 1]', '[TECHNOLOGY 2]'],
  //   featured: true,
  //   thumbnail: { src: '/images/projects/my-project-thumb.png', alt: 'Describe what the screenshot shows' },
  //   overview: '[WHAT THE PROJECT IS]',
  //   problem: '[THE PROBLEM IT ADDRESSES]',
  //   objectives: ['[OBJECTIVE 1]'],
  //   features: ['[FEATURE 1]'],
  //   role: '[WHAT YOU PERSONALLY BUILT]',
  //   challenges: ['[A REAL CHALLENGE YOU FACED]'],
  //   implementation: '[HOW YOU BUILT IT]',
  //   screenshots: [{ src: '/images/projects/my-project-1.png', alt: 'Describe the screenshot' }],
  //   lessonsLearned: ['[WHAT YOU LEARNED]'],
  //   githubUrl: 'https://github.com/your-username/your-repo',
  //   liveDemoUrl: 'https://your-demo-url.example',
  // },
]

/**
 * Optional section for academic work, research, experiments, or community activity.
 * Add ONLY things that are true. Leave the array empty to hide the section.
 */
export const highlights: Highlight[] = [
  {
    id: 'my-highlight',
    title: '[TITLE]',
    description: '[WHAT YOU ACTUALLY DID]',
    kind: 'Academic project',
    period: '[YEAR]',
    url: 'https://example.com', // only if the link really works
    urlLabel: 'View repository',
  },
]

export const contact: ContactContent = {
  heading: "Let's connect",
  // TODO: edit this so it sounds like you.
  message:
    "If you'd like to talk about a project, an opportunity, or web development in general, feel free to reach out.",
}

const allNavItems: NavItem[] = [
  { label: 'Home', sectionId: 'home' },
  { label: 'About', sectionId: 'about' },
  { label: 'Skills', sectionId: 'skills' },
  { label: 'Experience', sectionId: 'experience' },
  { label: 'Projects', sectionId: 'projects' },
  { label: 'Contact', sectionId: 'contact' },
]

const hasSkills = getVisibleSkillCategories(skillCategories).length > 0
const hasContact = hasContactDetails(profile)

/** Navigation only lists sections that will actually be shown. */
export const navItems: NavItem[] = allNavItems.filter((item) => {
  if (item.sectionId === 'skills') return hasSkills
  if (item.sectionId === 'contact') return hasContact
  return true
})