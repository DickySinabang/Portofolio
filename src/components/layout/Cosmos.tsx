import type { CSSProperties } from 'react'
import { ParticleField } from '../sections/ParticleField'
import { EarthJourney } from './EarthJourney'

const tint = (name: string): CSSProperties => ({ '--nebula-tint': `var(${name})` }) as CSSProperties

export function Cosmos() {
  return (
    <div
      aria-hidden="true"
      data-testid="cosmos"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="nebula -top-[18%] -left-[14%] size-[62vmax]"
        style={tint('--nebula-a')}
      />
      <div
        className="nebula -right-[18%] top-[30%] size-[56vmax] [animation-delay:-24s] [animation-direction:alternate-reverse]"
        style={tint('--nebula-b')}
      />
      <div
        className="nebula -bottom-[24%] left-[18%] size-[50vmax] [animation-delay:-48s]"
        style={tint('--nebula-c')}
      />
      <div className="galaxy" />
      <ParticleField className="absolute inset-0 size-full" />
      <EarthJourney />
      <div className="bg-noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />
    </div>
  )
}
