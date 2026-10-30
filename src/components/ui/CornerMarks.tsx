const corner = 'pointer-events-none absolute size-3 border-accent/70'

/**
 * Four small bracket marks for the corners of a panel (a "viewfinder" detail).
 * Decorative. The parent panel must be position: relative.
 */
export function CornerMarks() {
  return (
    <span aria-hidden="true">
      <i className={`${corner} top-2 left-2 border-t border-l`} />
      <i className={`${corner} top-2 right-2 border-t border-r`} />
      <i className={`${corner} bottom-2 left-2 border-b border-l`} />
      <i className={`${corner} right-2 bottom-2 border-r border-b`} />
    </span>
  )
}
