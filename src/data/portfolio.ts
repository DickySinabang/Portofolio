import type {
  AboutContent,
  HeroContent,
  NavItem,
  Profile,
  SiteConfig,
} from '../types/portfolio'

export const site: SiteConfig = {
  brand: 'DevPortfolio', 
  closingMessage: 'Thanks for stopping by.',
}

export const profile: Profile = {
  name: 'Your Name',
  title: 'Aspiring Full-Stack / Web Developer',
  
  
  email: '',
  githubUrl: '',
  linkedinUrl: '',
  cvUrl: '',
}

export const hero: HeroContent = {

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
  
  approach: [
    'Start by understanding the problem, then choose the tools.',
    'Build small working pieces first, then improve them.',
    'Read documentation and error messages carefully before changing code.',
  ],
  

}

export const navItems: NavItem[] = [
  { label: 'Home', sectionId: 'home' },
  { label: 'About', sectionId: 'about' },
  { label: 'Skills', sectionId: 'skills' },
  { label: 'Experience', sectionId: 'experience' },
  { label: 'Projects', sectionId: 'projects' },
  { label: 'Contact', sectionId: 'contact' },
]