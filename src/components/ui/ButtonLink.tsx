import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary'

type ButtonLinkProps = {
  children: ReactNode
  variant?: Variant
  
  to?: string
 
  href?: string

  download?: boolean
  className?: string
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:opacity-90',
  secondary:
    'border border-line bg-surface text-foreground hover:border-accent hover:text-accent',
}

export function ButtonLink({
  children,
  variant = 'primary',
  to,
  href,
  download,
  className = '',
}: ButtonLinkProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} download={download} className={classes}>
        {children}
      </a>
    )
  }

  return null
}