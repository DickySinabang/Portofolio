import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
  /** "wide" is for full-bleed editorial layouts such as the hero. */
  size?: 'default' | 'wide'
}

const widths = {
  default: 'max-w-6xl',
  wide: 'max-w-[88rem]',
}

export function Container({ children, className = '', size = 'default' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full ${widths[size]} px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  )
}
