import { useLocation } from 'react-router'
import { navItems } from '../../data/portfolio'
import { useActiveSection } from '../../hooks/useActiveSection'

const sectionIds = navItems.map((item) => item.sectionId)

/**
 * A thin progress rail on the right edge (wide screens, home page only) showing
 * which section you are in. Purely decorative: the navbar is the real navigation,
 * so this is hidden from assistive technology and cannot take focus.
 */
export function SectionRail() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const observed = useActiveSection(sectionIds, isHome)

  if (!isHome) return null
  const activeId = observed ?? 'home'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
    >
      {navItems.map((item, index) => {
        const active = item.sectionId === activeId
        return (
          <div
            key={item.sectionId}
            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]"
          >
            <span
              className={`transition-all duration-300 ${
                active ? 'translate-x-0 text-accent opacity-100' : 'translate-x-2 text-muted opacity-0'
              }`}
            >
              {String(index + 1).padStart(2, '0')} {item.label}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                active ? 'w-9 bg-accent' : 'w-4 bg-line'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}
