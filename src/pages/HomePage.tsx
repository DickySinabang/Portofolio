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
import { Section } from '../components/ui/Section'
import { navItems } from '../data/portfolio'


// Sections that are already built. Everything else is still a placeholder.
const builtSectionIds = ['home', 'about', 'skills', 'experience', 'projects']
const placeholderItems = navItems.filter(
  (item) => !builtSectionIds.includes(item.sectionId),
)

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
      <HighlightsSection />
      <ProjectsSection />
      <TerminalSection />
      <ContactSection />
      {placeholderItems.map((item) => (
        <Section
          key={item.sectionId}
          id={item.sectionId}
          eyebrow={item.label}
          title={item.label}
          className="min-h-[60vh]"
        >
          <p className="text-muted">Placeholder section, built in a later stage.</p>
        </Section>
      ))}
    </>
  )
}