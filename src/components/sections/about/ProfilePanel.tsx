import { about, profile } from '../../../data/portfolio'
import { CornerMarks } from '../../ui/CornerMarks'
import { SpotlightCard } from '../../ui/SpotlightCard'

type ProfilePanelProps = {
  className?: string
}

/** A compact identity "spec sheet": who I am, in a few labelled rows. */
export function ProfilePanel({ className = '' }: ProfilePanelProps) {
  const { education, photo } = about
  const rows: [string, string][] = [
    ['Role', profile.title],
    ['Education', education.degree],
    ['University', education.institution],
  ]

  return (
    <SpotlightCard className={className}>
      <CornerMarks />

      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <span aria-hidden="true" className="size-2 rounded-full bg-line" />
        <span aria-hidden="true" className="size-2 rounded-full bg-line" />
        <span aria-hidden="true" className="size-2 rounded-full bg-line" />
        <h3 className="ml-1 font-mono text-xs tracking-[0.18em] text-muted uppercase">Profile</h3>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <div className="flex items-center gap-5">
          {photo && (
            <img
              src={photo.src}
              alt={photo.alt}
              width={96}
              height={96}
              loading="lazy"
              className="size-20 shrink-0 rounded-lg border border-line object-cover sm:size-24"
            />
          )}
          <p className="font-display text-2xl font-semibold tracking-tight break-words sm:text-3xl">
            {profile.name}
          </p>
        </div>

        <dl className="mt-6 flex flex-1 flex-col justify-end">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-line py-3.5 first:border-t-0 sm:grid-cols-[7.5rem_1fr]"
            >
              <dt className="font-mono text-xs tracking-[0.14em] text-muted uppercase">{label}</dt>
              <dd className="text-sm font-medium text-foreground sm:text-base">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SpotlightCard>
  )
}
