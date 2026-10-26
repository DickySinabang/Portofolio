import type { PointerEvent, ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type TiltProps = {
  children: ReactNode
  className?: string
  /** Maximum rotation in degrees. */
  max?: number
}

/** Tilts its content in 3D toward the cursor. Does nothing with reduced motion. */
export function Tilt({ children, className = '', max = 8 }: TiltProps) {
  const reduced = useReducedMotion()

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.transform = ''
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}