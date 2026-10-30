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
  brand: 'Portofolio', 
  description:
    'Portfolio of an Information Technology graduate and aspiring full-stack web developer: projects, skills, and experience.',
  closingMessage: 'Thanks for stopping by.',
}

export const profile: Profile = {
  name: 'Dicky Latare Tricaesar Sinabang',
  title: 'Full-Stack Developer',
  email: 'dickysinabang@gmail.com',
  githubUrl: 'https://github.com/DickySinabang',
  linkedinUrl: 'https://www.linkedin.com/in/dickylatare766',
  cvUrl: '/cv/Dicky Latare Tricaesar Sinabang-resume.pdf',
}

export const hero: HeroContent = {
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
  approach: [
    'Start by understanding the problem, then choose the tools.',
    'Build small working pieces first, then improve them.',
    'Read documentation and error messages carefully before changing code.',
  ],
  photo: {
    src: '/images/Pas Foto 4x6.jpeg',
    alt: 'A photo of Dicky Latare Tricaesar Sinabang',
  },
}

/**
 * Skills. Keep only what you have really used or are really learning, and be
 * ready to talk about each one in an interview.
 *   status: 'used'     -> you have worked with it
 *   status: 'learning' -> you are currently studying it
 * Categories with no skills are hidden automatically.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    skills: [{ name: 'React', status: 'used' }],
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
    skills: [{ name: 'MySQL', status: 'used' }],
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    skills: [{ name: 'Flutter', status: 'used' }],
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

/**
 * Experience. Replace the bracketed values with the real ones. To add another
 * position, copy the whole object below and paste it after it (with a comma).
 */
export const experience: ExperienceEntry[] = [
  {
    id: 'karya-multi-solution-intern',
    position: 'Full-Stack Developer Intern',
    organization: 'PT Karya Multi Solution Indonesia',
    employmentType: 'Internship',
    location: '[CITY, COUNTRY]',
    startDate: '[MONTH YEAR]',
    endDate: '[MONTH YEAR]',
    description: 'Worked on an IoT-based smart building monitoring project.',
    responsibilities: [
      'Used web technologies and databases to support monitoring and dashboard functionality.',
      'Participated in IoT development and sensor integration activities.',
    ],
    // List only technologies you really used during this internship.
    technologies: ['[TECHNOLOGY 1]', '[TECHNOLOGY 2]'],
  },
]

/**
 * Projects. The object below is a complete template. To add a project, copy
 * the whole object, paste it after the last one (with a comma), and fill it in.
 *
 *  - slug: unique, lowercase, letters/numbers/hyphens. It becomes /projects/<slug>.
 *  - category: 'web' | 'backend' | 'mobile' | 'iot' | 'machine-learning'
 *  - Screenshots: put image files in public/images/projects/ and reference them
 *    as '/images/projects/your-file.png'.
 *  - Delete any optional line you have no real answer for. Only keep githubUrl
 *    and liveDemoUrl if the link really works.
 */
export const projects: Project[] = [
  {
    slug: 'your-project-name',
    title: '[PROJECT NAME]',
    description: '[PROJECT DESCRIPTION IN ONE OR TWO SENTENCES]',
    category: 'web',
    technologies: ['[TECHNOLOGY 1]', '[TECHNOLOGY 2]'],
    featured: true,
    thumbnail: {
      src: '/images/projects/project-placeholder-thumbnail.svg',
      alt: '[DESCRIBE WHAT THE THUMBNAIL SHOWS]',
    },
    overview: '[WHAT THE PROJECT IS]',
    problem: '[THE PROBLEM IT ADDRESSES]',
    objectives: ['[OBJECTIVE 1]', '[OBJECTIVE 2]'],
    features: ['[FEATURE 1]', '[FEATURE 2]'],
    role: '[WHAT YOU PERSONALLY BUILT]',
    implementation: '[HOW YOU BUILT IT]',
    challenges: ['[A REAL CHALLENGE YOU FACED]'],
    screenshots: [
      {
        src: '/images/projects/project-placeholder-screenshot.svg',
        alt: '[DESCRIBE WHAT THE SCREENSHOT SHOWS]',
      },
    ],
    lessonsLearned: ['[WHAT YOU LEARNED]'],
    githubUrl: 'https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPOSITORY',
    liveDemoUrl: 'https://YOUR-DEMO-URL.example',
  },
]

/**
 * Optional section for academic work, research, experiments, or community
 * activity. Add only things that are true. An empty list hides the section.
 */
export const highlights: Highlight[] = [
  {
    id: 'highlight-template',
    title: '[HIGHLIGHT TITLE]',
    description: '[WHAT YOU ACTUALLY DID]',
    kind: '[TYPE OF HIGHLIGHT]',
    period: '[YEAR]',
    url: 'https://YOUR-LINK.example',
    urlLabel: '[LINK LABEL]',
  },
]

export const contact: ContactContent = {
  heading: "Let's connect",
  // Edit this so it sounds like you.
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