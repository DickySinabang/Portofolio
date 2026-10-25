import { AboutSection } from '../components/sections/AboutSection'
import { HeroSection } from '../components/sections/HeroSection'
import { Section } from '../components/ui/Section'
import { navItems } from '../data/portfolio'


const builtSectionIds = ['home', 'about']
const placeholderItems = navItems.filter(
  (item) => !builtSectionIds.includes(item.sectionId),
)

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
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