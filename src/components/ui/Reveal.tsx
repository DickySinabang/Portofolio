import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

type Variant = 'up' | 'left' | 'fade'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Delay in milliseconds, used to stagger neighbouring items. */
  delay?: number
  /** How the content enters: slide up (default), slide in from the left, or just fade. */
  variant?: Variant
}

const hidden: Record<Variant, string> = {
  up: 'translate-y-6 opacity-0',
  left: '-translate-x-8 opacity-0',
  fade: 'opacity-0',
}

const shown: Record<Variant, string> = {
  up: 'translate-y-0 opacity-100',
  left: 'translate-x-0 opacity-100',
  fade: 'opacity-100',
}

/**
 * Fades and slides its content in the first time it scrolls into view. It also
 * sets data-visible, so children can react with Tailwind's group-data variants.
 */
export function Reveal({ children, className = '', delay = 0, variant = 'up' }: RevealProps) {
  const [ref, visible] = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? shown[variant] : hidden[variant]
      } ${className}`}
    >
      {children}
    </div>
  )
}
