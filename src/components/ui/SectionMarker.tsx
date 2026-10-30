type SectionMarkerProps = {
  /** Two-digit position, e.g. "01". Leave out for sections that are not in the navigation. */
  index?: string
  label: string
  className?: string
}

/** Small technical label such as "01 / INTRO" used to open a section. */
export function SectionMarker({ index, label, className = '' }: SectionMarkerProps) {
  return (
    <p className={`font-mono text-xs uppercase tracking-[0.18em] text-muted ${className}`}>
      {index && (
        <>
          <span className="text-accent">{index}</span>{' '}
          <span aria-hidden="true">/</span>{' '}
        </>
      )}
      {label}
    </p>
  )
}
