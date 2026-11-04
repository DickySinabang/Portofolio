import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// The class on <html> is the single source of truth (set early by index.html).
function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

// Colours of the browser bar on phones; they match each theme's --bg.
const THEME_COLORS: Record<Theme, string> = { dark: '#02040b', light: '#cfd8fa' }

let transitionTimer: number | undefined

function applyTheme(theme: Theme) {
  const root = document.documentElement
  // Let colours glide for a moment instead of jumping.
  root.classList.add('theme-transition')
  window.clearTimeout(transitionTimer)
  transitionTimer = window.setTimeout(() => root.classList.remove('theme-transition'), 700)

  root.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be blocked (private mode); the theme still works for this visit.
  }
  listeners.forEach((listener) => listener())
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, (): Theme => 'dark')

  const toggleTheme = useCallback(() => {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, toggleTheme }
}