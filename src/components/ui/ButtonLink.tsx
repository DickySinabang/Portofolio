import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary'

type ButtonLinkProps = {
  children: ReactNode
  variant?: Variant
  /** Internal route or hash path, e.g. "/#projects". */
  to?: string
  /** Plain URL or file path, e.g. the CV file or a mailto: link. */
  href?: string
  /** Set for files such as the CV so the browser downloads them. */
  download?: boolean
  /** Opens in a new tab, with safe rel attributes and a screen-reader hint. */
  external?: boolean
  className?: string
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors'

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-fg hover:opacity-90 hover:shadow-[0_0_28px_-6px_var(--accent)]',
  secondary:
    'border border-line bg-surface text-foreground hover:border-accent hover:text-accent',
}

/** Link that looks like a button. Uses React Router for internal paths. */
export function ButtonLink({
  children,
  variant = 'primary',
  to,
  href,
  download,
  external,
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
      <a
        href={href}
        download={download}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={classes}
      >
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }

  return null
}