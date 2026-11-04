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
  title: 'FullStack Developer',
  email: 'dickysinabang@gmail.com',
  githubUrl: 'https://github.com/DickySinabang',
  linkedinUrl: 'https://www.linkedin.com/in/dickylatare766',
  cvUrl: '/cv/Dicky Latare Tricaesar Sinabang-resume.pdf',
}

export const hero: HeroContent = {
  headline: 'Building digital experiences through code.',
}

export const about: AboutContent = {
  headline: ['Turning ideas', 'into reality.'],
  paragraphs: [
    'Im an Information Technology graduate from Telkom University with an interest in building web applications and backend systems. I enjoy turning ideas into practical digital solutions, exploring new technologies, and developing applications that are functional, reliable, and user friendly.',
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
    src: '/images/Pas Foto.webp',
    alt: 'Dicky Latare Tricaesar Sinabang',
  },
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    label: 'Interface',
    description: 'Building responsive, component driven web interfaces with a focus on usability and seamless user experiences.',
    skills: [
      { name: 'React', status: 'used' },
      { name: 'JavaScript', status: 'used' },
      { name: 'TypeScript', status: 'used' },
      { name: 'Tailwind', status: 'used' },
      { name: 'Vite', status: 'used' },
      { name: 'Three.js', status: 'used' },
      { name: 'React Router', status: 'used' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    label: 'Server side',
    description: 'Developing server-side applications, REST APIs, and application logic.',
    skills: [
      { name: 'Laravel', status: 'used' },
      { name: 'PHP', status: 'used' },
      { name: 'Python', status: 'used' },
      { name: 'REST API development', status: 'used' },
      { name: 'Go', status: 'used' },
    ],
  },
  {
    id: 'database-tools',
    title: 'Database & Development Tools',
    label: 'Data & Tools',
    description: 'Managing relational databases and streamlining development workflows.',
    skills: [
      { name: 'MySQL', status: 'used' },
      { name: 'Git', status: 'used' },
      { name: 'GitHub', status: 'used' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Application Development',
    label: 'Cross-platform',
    description: 'Building mobile applications with Flutter.',
    skills: [
      { name: 'Flutter', status: 'used' },
      { name: 'Dart', status: 'used' },
    ],
  },
  {
    id: 'iot',
    title: 'IoT Development',
    label: 'Embedded Systems',
    description: 'Integrating embedded devices and sensors with software monitoring systems.',
    skills: [
      { name: 'IoT Sensors', status: 'used' },
      { name: 'Arduino IDE', status: 'used' },
      { name: 'C++', status: 'learning' },
    ],
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    label: 'Applied Inteligence',
    description: 'Learning the fundamentals of machine learning.',
    skills: [
      { name: 'TensorFlow', status: 'used' },
      { name: 'LSTM', status: 'learning' },
      { name: 'Google Colab', status: 'used' },
    ],
  },
]

export const experience: ExperienceEntry[] = [
  {
    id: 'karya-multi-solution-intern',
    position: 'FullStack Developer Intern',
    organization: 'PT Karya Multi Solution Indonesia',
    employmentType: 'Internship',
    location: 'Bogor, Indonesia',
    startDate: 'Jun 2025',
    endDate: 'Aug 2025',
    description: 'IoT-based smart building monitoring project.',
    responsibilities: [
      'Built monitoring and dashboard features using web technologies and databases.',
      'Worked on IoT development and sensor integration.',
    ],
    // List only technologies you really used during this internship.
    technologies: ['PHP', 'IoT', 'C++'],
  },
]

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
  message: 'Have a project or an opportunity in mind? Let’s talk.',
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