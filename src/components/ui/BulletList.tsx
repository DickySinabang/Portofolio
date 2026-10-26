export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}