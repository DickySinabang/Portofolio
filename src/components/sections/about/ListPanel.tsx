import type { LucideIcon } from 'lucide-react'
import { SpotlightCard } from '../../ui/SpotlightCard'

type ListPanelProps = {
  title: string
  icon: LucideIcon
  items: string[]
  /** An ordered list suits steps; an unordered one suits a set of topics. */
  ordered?: boolean
}

/** A titled, numbered list inside a panel. Used for interests and how I learn. */
export function ListPanel({ title, icon: Icon, items, ordered = false }: ListPanelProps) {
  const List = ordered ? 'ol' : 'ul'

  return (
    <SpotlightCard className="h-full">
      <div className="flex h-full flex-col p-6 sm:p-8">
        <h3 className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight">
          <Icon aria-hidden="true" className="size-5 text-accent-2" />
          {title}
        </h3>

        {/* Rows share the panel's height, so a short list never leaves a blank area. */}
        <List className="mt-5 flex flex-1 flex-col divide-y divide-line">
          {items.map((item, index) => (
            <li key={item} className="flex flex-1 items-center gap-4 py-3.5">
              <span aria-hidden="true" className="font-mono text-xs text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </List>
      </div>
    </SpotlightCard>
  )
}
