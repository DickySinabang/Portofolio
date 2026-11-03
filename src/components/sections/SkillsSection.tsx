import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Cpu,
  Database,
  Monitor,
  Server,
  Smartphone,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { skillCategories } from '../../data/portfolio'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { pinnedProgress, pinnedTravel } from '../../lib/pinned'
import { subscribeScroll } from '../../lib/scrollBus'
import { getVisibleSkillCategories } from '../../lib/skills'
import type { Skill, SkillCategory } from '../../types/portfolio'
import { Container } from '../ui/Container'
import { Section, SectionHeader } from '../ui/Section'

const categoryIcons: Record<string, LucideIcon> = {
  frontend: Monitor,
  backend: Server,
  languages: Code,
  database: Database,
  mobile: Smartphone,
  'iot-ml': Cpu,
  tools: Wrench,
}

function SkillBadge({ skill }: { skill: Skill }) {
  const learning = skill.status === 'learning'

  return (
    <li
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm ${
        learning ? 'border-dashed border-accent' : 'border-line bg-background/60'
      }`}
    >
      {skill.name}
      {/* Visible text, so the status is not communicated by the border style alone. */}
      {learning && <span className="text-xs text-muted">Learning</span>}
    </li>
  )
}

const CARD_GAP = 20 // px, the gap-5 between cards

/** One category: a module on the rail, with a node where the rail line passes through it. */
function SkillCard({ category }: { category: SkillCategory }) {
  const Icon = categoryIcons[category.id] ?? Code
  return (
    <div className="group relative w-[min(78vw,20rem)] shrink-0 snap-start rounded-lg border border-line bg-surface/70 p-6 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_2rem_-0.6rem_var(--accent)]">
      <span
        aria-hidden="true"
        className="absolute -top-[1.1rem] left-6 size-2 rounded-full bg-accent-3 shadow-[0_0_0.6rem_var(--accent-3)]"
      />
      <span
        aria-hidden="true"
        className="absolute -top-[0.75rem] -right-5 left-8 h-px bg-linear-to-r from-accent/60 to-line"
      />
      <h3 className="flex items-center gap-2 text-lg font-medium">
        <Icon aria-hidden="true" className="size-5 text-accent transition-transform duration-300 group-hover:scale-110" />
        {category.title}
      </h3>
      <p className="mt-1 font-mono text-xs text-muted">
        {category.skills.length} {category.skills.length === 1 ? 'skill' : 'skills'}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <SkillBadge key={skill.name} skill={skill} />
        ))}
      </ul>
    </div>
  )
}

function Legend() {
  return (
    <p className="max-w-2xl text-sm text-muted">
      Solid badges are technologies I have worked with. Dashed badges marked &ldquo;Learning&rdquo; are ones I am
      currently studying.
    </p>
  )
}

/**
 * Wide screens: the section pins to the viewport and the cards slide sideways as you keep
 * scrolling down. It is plain `position: sticky` inside a taller section, so the browser does
 * all the scrolling: no wheel listeners, nothing hijacked, and it releases by itself after the
 * last card. The track's position is simply "how far through the extra height are we".
 */
function PinnedSkills({ categories, showLegend }: { categories: SkillCategory[]; showLegend: boolean }) {
  const reduced = useReducedMotion()
  const [travel, setTravel] = useState(0)
  const outerRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const metrics = useRef({ top: 0, travel: 0, step: 1, progress: 0 })

  const apply = useCallback((scrollY: number) => {
    const { top, travel: distance } = metrics.current
    const progress = pinnedProgress(scrollY, top, distance)
    metrics.current.progress = progress
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px,0,0)`
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`
    if (prevRef.current) prevRef.current.disabled = progress <= 0.002
    if (nextRef.current) nextRef.current.disabled = progress >= 0.998
  }, [])

  const measure = useCallback(() => {
    const outer = outerRef.current
    const box = boxRef.current
    const track = trackRef.current
    if (!outer || !box || !track) return
    const distance = pinnedTravel(track.scrollWidth, box.clientWidth)
    const firstCard = track.firstElementChild as HTMLElement | null
    metrics.current.top = outer.getBoundingClientRect().top + window.scrollY
    metrics.current.travel = distance
    metrics.current.step = (firstCard?.getBoundingClientRect().width ?? 320) + CARD_GAP
    setTravel(distance)
    apply(window.scrollY)
  }, [apply])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (boxRef.current) observer.observe(boxRef.current)
    if (trackRef.current) observer.observe(trackRef.current)
    observer.observe(document.body) // the page above can change height (images, fonts)
    const unsubscribe = subscribeScroll(apply)
    return () => {
      observer.disconnect()
      unsubscribe()
    }
  }, [measure, apply, categories.length])

  // The arrows are optional extras: they just scroll the page to the matching spot.
  const move = (direction: 1 | -1) => {
    const { top, travel: distance, step, progress } = metrics.current
    const index = Math.round((progress * distance) / step)
    const target = Math.min(Math.max((index + direction) * step, 0), distance)
    window.scrollTo({ top: top + target, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section
      id="skills"
      ref={outerRef}
      aria-labelledby="skills-heading"
      style={{ height: `calc(100svh + ${travel}px)` }}
      className="relative border-b border-line"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-24 pb-8">
        <Container size="wide" className="w-full">
          <SectionHeader id="skills" eyebrow="Skills" title="Tools and technologies" />
          {showLegend && (
            <div className="mt-8">
              <Legend />
            </div>
          )}

          <div ref={boxRef} className="mt-10">
            <div
              ref={trackRef}
              role="region"
              aria-label="Skill categories, they slide sideways as you scroll"
              className="flex w-max gap-5 pt-6 will-change-transform"
            >
              {categories.map((category) => (
                <SkillCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div aria-hidden="true" className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-line">
              <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 rounded-full bg-accent" />
            </div>
            <div className="flex gap-2">
              <button
                ref={prevRef}
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous skills"
                disabled
                className="rounded-md border border-line bg-surface/70 p-2 transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                ref={nextRef}
                type="button"
                onClick={() => move(1)}
                aria-label="Next skills"
                className="rounded-md border border-line bg-surface/70 p-2 transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

/** Scroll position of the rail: how much is hidden on each side, and the thumb size. */
type RailState = { atStart: boolean; atEnd: boolean; start: number; size: number }

/**
 * Phones, short windows and visitors who prefer less motion: no pinning. The cards sit on a
 * rail that scrolls sideways by touch, trackpad or the arrow buttons, and the page keeps
 * scrolling normally above and below it.
 */
function SkillsRail({ categories, showLegend }: { categories: SkillCategory[]; showLegend: boolean }) {
  const reduced = useReducedMotion()
  const railRef = useRef<HTMLDivElement>(null)
  const [rail, setRail] = useState<RailState>({ atStart: true, atEnd: false, start: 0, size: 1 })

  const measure = useCallback(() => {
    const element = railRef.current
    if (!element) return
    const { scrollLeft, scrollWidth, clientWidth } = element
    const max = Math.max(scrollWidth - clientWidth, 0)
    setRail({
      atStart: scrollLeft <= 2,
      atEnd: scrollLeft >= max - 2,
      start: scrollWidth ? scrollLeft / scrollWidth : 0,
      size: scrollWidth ? Math.min(clientWidth / scrollWidth, 1) : 1,
    })
  }, [])

  useEffect(() => {
    const element = railRef.current
    if (!element) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [measure, categories.length])

  const move = (direction: 1 | -1) => {
    const element = railRef.current
    if (!element) return
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <Section id="skills" eyebrow="Skills" title="Tools and technologies">
      {showLegend && (
        <div className="mb-8">
          <Legend />
        </div>
      )}

      <div className="relative">
        {/* The rail itself scrolls sideways; the page never does. It is focusable so
            keyboard users can scroll it with the arrow keys. */}
        <div
          ref={railRef}
          onScroll={measure}
          role="region"
          aria-label="Skill categories, scrolls sideways"
          tabIndex={0}
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pt-6 pb-4 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <SkillCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div aria-hidden="true" className="relative h-px flex-1 bg-line">
            <span
              className="absolute -top-px h-0.5 rounded-full bg-accent transition-[left,width] duration-150"
              style={{ left: `${rail.start * 100}%`, width: `${rail.size * 100}%` }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={rail.atStart}
              aria-label="Previous skills"
              className="rounded-md border border-line bg-surface/70 p-2 transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={rail.atEnd}
              aria-label="Next skills"
              className="rounded-md border border-line bg-surface/70 p-2 transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function SkillsSection() {
  const categories = getVisibleSkillCategories(skillCategories)
  const reduced = useReducedMotion()
  // The pinned experience needs room: a wide window that is also tall enough for the content.
  const roomy = useMediaQuery('(min-width: 768px) and (min-height: 600px)')

  if (categories.length === 0) return null

  const showLegend = categories.some((category) =>
    category.skills.some((skill) => skill.status === 'learning'),
  )

  return roomy && !reduced ? (
    <PinnedSkills categories={categories} showLegend={showLegend} />
  ) : (
    <SkillsRail categories={categories} showLegend={showLegend} />
  )
}
