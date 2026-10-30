import { about, profile } from '../../data/portfolio'

type HeroCodeCardProps = {
  className?: string
}

/**
 * A compact "readout" card that overlaps the 3D artifact. It only shows facts
 * that are already in portfolio.ts, wraps instead of clipping, and is hidden
 * from assistive technology because the same facts are in the page text.
 */
export function HeroCodeCard({ className = '' }: HeroCodeCardProps) {
  const rows: [string, string][] = [
    ['name', profile.name],
    ['role', profile.title],
    ['school', about.education.institution],
  ]

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-lg border border-line bg-surface/80 shadow-[0_0_60px_-28px_var(--accent)] backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="ml-1 font-mono text-[11px] text-muted">developer.ts</span>
      </div>
      <pre className="p-4 font-mono text-xs leading-6 break-words whitespace-pre-wrap text-muted">
        <code>
          <span className="text-accent-2">const</span> developer = {'{'}
          {rows.map(([key, value]) => (
            <span key={key} className="block pl-4">
              <span className="text-foreground">{key}</span>:{' '}
              <span className="text-accent">{JSON.stringify(value)}</span>,
            </span>
          ))}
          {'}'}
        </code>
      </pre>
    </div>
  )
}
