import {
  siFlutter,
  siGit,
  siGithub,
  siJavascript,
  siLaravel,
  siMysql,
  siPhp,
  siPython,
  siReact,
  siTypescript,
} from 'simple-icons'

/** What to draw for one skill: a brand logo when there is one, otherwise a generic icon. */
export type SkillVisual = {
  /** The short name shown under the icon. */
  label: string
  /** SVG path of the brand logo (24x24 viewBox). Missing for skills without a logo. */
  brandPath?: string
  /** Which generic icon to use when there is no brand logo. */
  fallback: 'api' | 'iot' | 'ml' | 'generic'
}

const brands: Record<string, { label: string; path: string }> = {
  react: { label: 'React', path: siReact.path },
  laravel: { label: 'Laravel', path: siLaravel.path },
  php: { label: 'PHP', path: siPhp.path },
  javascript: { label: 'JavaScript', path: siJavascript.path },
  typescript: { label: 'TypeScript', path: siTypescript.path },
  python: { label: 'Python', path: siPython.path },
  mysql: { label: 'MySQL', path: siMysql.path },
  flutter: { label: 'Flutter', path: siFlutter.path },
  git: { label: 'Git', path: siGit.path },
  github: { label: 'GitHub', path: siGithub.path },
}

/** Skills that are not a single product, so they get a short label and a generic icon. */
const concepts: Record<string, { label: string; fallback: SkillVisual['fallback'] }> = {
  'rest api development': { label: 'REST API', fallback: 'api' },
  'iot sensor integration': { label: 'IoT Sensors', fallback: 'iot' },
  'machine learning (basics)': { label: 'Machine Learning', fallback: 'ml' },
}

export function getSkillVisual(name: string): SkillVisual {
  const key = name.trim().toLowerCase()

  const brand = brands[key]
  if (brand) return { label: brand.label, brandPath: brand.path, fallback: 'generic' }

  const concept = concepts[key]
  if (concept) return { label: concept.label, fallback: concept.fallback }

  return { label: name.trim(), fallback: 'generic' }
}