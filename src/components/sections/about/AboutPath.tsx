import type { PathNode } from '../../../lib/about'
import { Reveal } from '../../ui/Reveal'

type AboutPathProps = {
  nodes: PathNode[]
  className?: string
}

export function AboutPath({ nodes, className = '' }: AboutPathProps) {
  if (nodes.length < 2) return null

  return (
    <Reveal className={`group/path ${className}`}>
      <h3 className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Path</h3>

      <ol className="relative mt-8 grid gap-8 md:grid-flow-col md:auto-cols-fr md:gap-6">
        {/* The connecting line: vertical on phones, horizontal from md up. */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[0.4375rem] w-px origin-top scale-y-0 bg-linear-to-b from-accent via-accent-2 to-line transition-transform duration-1000 ease-out group-data-[visible=true]/path:scale-y-100 md:hidden"
        />
        <span
          aria-hidden="true"
          className="absolute top-[0.4375rem] right-2 left-2 hidden h-px origin-left scale-x-0 bg-linear-to-r from-accent via-accent-2 to-line transition-transform duration-1000 ease-out group-data-[visible=true]/path:scale-x-100 md:block"
        />

        {nodes.map((node, index) => {
          const isNow = index === nodes.length - 1
          return (
            <li key={node.id} className="relative pl-9 md:pt-9 md:pl-0">
              <span
                aria-hidden="true"
                className={`absolute top-1 left-0 size-3.5 rounded-full border-2 md:top-0 ${
                  isNow
                    ? 'border-accent-3 bg-accent-3 shadow-[0_0_16px_2px_color-mix(in_srgb,var(--accent-3)_50%,transparent)]'
                    : 'border-accent bg-background'
                }`}
              />
              <p className="font-mono text-xs tracking-[0.14em] text-accent uppercase">
                {node.label}
              </p>
              <p className="mt-1.5 font-display text-lg font-semibold tracking-tight">{node.title}</p>
              <p className="mt-0.5 text-sm text-muted">{node.detail}</p>
            </li>
          )
        })}
      </ol>
    </Reveal>
  )
}
