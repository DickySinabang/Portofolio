import type { CSSProperties } from 'react'
import { ParticleField } from '../sections/ParticleField'
import { EarthJourney } from './EarthJourney'

const tint = (name: string): CSSProperties => ({ '--nebula-tint': `var(${name})` }) as CSSProperties
const orb = (name: string): CSSProperties => ({ '--orb-tint': `var(${name})` }) as CSSProperties

export function Cosmos() {
  return (
    <div
      aria-hidden="true"
      data-testid="cosmos"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="sky" />
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
      <div
        className="glow-orb top-[14%] left-[8%] size-[22rem]"
        style={orb('--accent-2')}
      />
      <div
        className="glow-orb top-[58%] right-[6%] size-[26rem] [animation-delay:-8s]"
        style={orb('--accent')}
      />
      <ParticleField className="absolute inset-0 size-full" />
      <div className="planet-layer">
        <EarthJourney />
      </div>
      <div className="bg-noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />
    </div>
  )
}