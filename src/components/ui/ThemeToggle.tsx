import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const iconBase = 'absolute size-4 transition-all duration-500 ease-out'

/** Sun and moon sit on top of each other; the one for the other theme turns in as the current one turns out. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="group relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-line bg-surface/70 text-foreground transition duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_1.2rem_-0.2rem_var(--accent)] active:scale-95"
    >
      <Sun
        aria-hidden="true"
        className={`${iconBase} ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'}`}
      />
      <Moon
        aria-hidden="true"
        className={`${iconBase} ${isDark ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
      />
    </button>
  )
}