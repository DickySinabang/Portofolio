import type { PointerEvent, ReactNode } from 'react'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'article'
}

/**
 * A card with a soft glow that follows the cursor. The position is written
 * straight to CSS variables, so React never re-renders while the mouse moves.
 */
export function SpotlightCard({
  children,
  className = '',
  as: Tag = 'div',
}: SpotlightCardProps) {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <Tag
      onPointerMove={handlePointerMove}
      className={`group relative overflow-hidden rounded-xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/50 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 16%, transparent), transparent 65%)',
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </Tag>
  )
}