import { AboutSection } from '../components/sections/AboutSection'
import { ContactSection } from '../components/sections/ContactSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { HeroSection } from '../components/sections/HeroSection'
import { HighlightsSection } from '../components/sections/HighlightsSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { TerminalSection } from '../components/sections/TerminalSection'
import { profile, site } from '../data/portfolio'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { features } from '../lib/features'

export function HomePage() {
  useDocumentMeta({
    title: `${profile.name} | ${profile.title}`,
    description: site.description,
  })

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      {features.highlights && <HighlightsSection />}
      <ProjectsSection />
      {features.terminal && <TerminalSection />}
      <ContactSection />
    </>
  )
}
