import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-background px-2.5 py-1 text-sm text-foreground">
      {children}
    </span>
  )
}