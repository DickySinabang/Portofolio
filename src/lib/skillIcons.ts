import {
  siArduino,
  siCplusplus,
  siCss,
  siDart,
  siFlutter,
  siGit,
  siGithub,
  siGo,
  siGooglecolab,
  siHtml5,
  siJavascript,
  siLaravel,
  siMysql,
  siPhp,
  siPython,
  siReact,
  siReactrouter,
  siTailwindcss,
  siTensorflow,
  siThreedotjs,
  siTypescript,
  siVite,
} from 'simple-icons'

/** What to draw for one skill: a brand logo when there is one, otherwise a generic icon. */
export type SkillVisual = {
  /** The short name shown on the badge. */
  label: string
  /** SVG path of the brand logo (24x24 viewBox). Missing for skills without a logo. */
  brandPath?: string
  /** The skill's colour, e.g. "#61DAFB". Used for its hover glow. */
  brandColor?: string
  /** Which generic icon to use when there is no brand logo. */
  fallback: 'api' | 'iot' | 'ml' | 'generic'
}

/**
 * Brand logos, keyed by the skill name in lowercase. To show a logo for a new
 * skill, import its icon from 'simple-icons' above and add one line here.
 */
const brands: Record<string, { label: string; path: string; hex: string }> = {
  // Frontend
  react: { label: 'React', path: siReact.path, hex: siReact.hex },
  javascript: { label: 'JavaScript', path: siJavascript.path, hex: siJavascript.hex },
  typescript: { label: 'TypeScript', path: siTypescript.path, hex: siTypescript.hex },
  tailwind: { label: 'Tailwind CSS', path: siTailwindcss.path, hex: siTailwindcss.hex },
  'tailwind css': { label: 'Tailwind CSS', path: siTailwindcss.path, hex: siTailwindcss.hex },
  vite: { label: 'Vite', path: siVite.path, hex: siVite.hex },
  'three.js': { label: 'Three.js', path: siThreedotjs.path, hex: siThreedotjs.hex },
  'react router': { label: 'React Router', path: siReactrouter.path, hex: siReactrouter.hex },
  html: { label: 'HTML', path: siHtml5.path, hex: siHtml5.hex },
  css: { label: 'CSS', path: siCss.path, hex: siCss.hex },
  // Backend
  laravel: { label: 'Laravel', path: siLaravel.path, hex: siLaravel.hex },
  php: { label: 'PHP', path: siPhp.path, hex: siPhp.hex },
  python: { label: 'Python', path: siPython.path, hex: siPython.hex },
  go: { label: 'Go', path: siGo.path, hex: siGo.hex },
  // Database and tools
  mysql: { label: 'MySQL', path: siMysql.path, hex: siMysql.hex },
  git: { label: 'Git', path: siGit.path, hex: siGit.hex },
  github: { label: 'GitHub', path: siGithub.path, hex: siGithub.hex },
  // Mobile
  flutter: { label: 'Flutter', path: siFlutter.path, hex: siFlutter.hex },
  dart: { label: 'Dart', path: siDart.path, hex: siDart.hex },
  // IoT
  'arduino ide': { label: 'Arduino IDE', path: siArduino.path, hex: siArduino.hex },
  'c++': { label: 'C++', path: siCplusplus.path, hex: siCplusplus.hex },
  // AI
  tensorflow: { label: 'TensorFlow', path: siTensorflow.path, hex: siTensorflow.hex },
  'google colab': { label: 'Google Colab', path: siGooglecolab.path, hex: siGooglecolab.hex },
}

/**
 * Skills that are not a single product, so they get a short label, a generic icon and
 * their own hover colour.
 */
const concepts: Record<
  string,
  { label: string; fallback: SkillVisual['fallback']; color: string }
> = {
  'rest api development': { label: 'REST API', fallback: 'api', color: '#0EA5E9' },
  'iot sensors': { label: 'IoT Sensors', fallback: 'iot', color: '#10B981' },
  'iot sensor integration': { label: 'IoT Sensors', fallback: 'iot', color: '#10B981' },
  lstm: { label: 'LSTM', fallback: 'ml', color: '#A78BFA' },
  'machine learning (basics)': { label: 'Machine Learning', fallback: 'ml', color: '#A78BFA' },
}

/** A very dark brand colour (GitHub, Three.js) would give no visible glow, so use a soft blue. */
function glowColor(hex: string): string {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 60 ? '#8B9CFF' : `#${hex}`
}

export function getSkillVisual(name: string): SkillVisual {
  const key = name.trim().toLowerCase()

  const brand = brands[key]
  if (brand) {
    return {
      label: brand.label,
      brandPath: brand.path,
      brandColor: glowColor(brand.hex),
      fallback: 'generic',
    }
  }

  const concept = concepts[key]
  if (concept) {
    return { label: concept.label, brandColor: concept.color, fallback: concept.fallback }
  }

  return { label: name.trim(), fallback: 'generic' }
}