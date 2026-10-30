import { useRef, type CSSProperties } from 'react'
import { skillCategories } from '../../data/portfolio'
import { usePointerParallax } from '../../hooks/usePointerParallax'
import { pickUsedSkills } from '../../lib/skills'

// Six faces of a cube: rotate each into place, then push it out by half the cube size.
const faceRotations = [
  'rotateY(0deg)',
  'rotateY(90deg)',
  'rotateY(180deg)',
  'rotateY(-90deg)',
  'rotateX(90deg)',
  'rotateX(-90deg)',
]

function CubeFaces({ tone }: { tone: 'accent' | 'accent-2' }) {
  const color = tone === 'accent' ? 'var(--accent)' : 'var(--accent-2)'
  return (
    <>
      {faceRotations.map((rotation) => (
        <i
          key={rotation}
          className="absolute inset-0 border"
          style={{
            transform: `${rotation} translateZ(calc(var(--size) / 2))`,
            borderColor: `color-mix(in srgb, ${color} 55%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${color} 5%, transparent)`,
            // A fine 4x4 grid on every face makes it read as a technical object.
            backgroundImage: `linear-gradient(to right, color-mix(in srgb, ${color} 22%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, ${color} 22%, transparent) 1px, transparent 1px)`,
            backgroundSize: '25% 25%',
          }}
        />
      ))}
    </>
  )
}

/**
 * A slowly turning wireframe object (cube within a cube, orbit rings, and
 * labelled skills circling it) built from CSS 3D transforms. It tilts toward the
 * pointer, needs no WebGL, and is decorative, so assistive technology skips it.
 */
export function HeroArtifact() {
  const rootRef = useRef<HTMLDivElement>(null)
  usePointerParallax(rootRef)
  const labels = pickUsedSkills(skillCategories, 5)

  return (
    // The outer box is a "container" so the orbit radius can be set in cqw
    // (a percentage of this box's own width) and scale with the artifact.
    <div className="relative aspect-square w-full [container-type:inline-size]">
      <div
        ref={rootRef}
        aria-hidden="true"
        className="absolute inset-0 [--cube:clamp(6rem,17vw,11.5rem)] [perspective:1100px]"
      >
        <div className="absolute inset-[22%] rounded-full bg-accent/20 blur-3xl" />

        {/* Tilts toward the pointer. */}
        <div
          className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]"
          style={{
            transform:
              'rotateX(calc(var(--py, 0) * -14deg)) rotateY(calc(var(--px, 0) * 18deg))',
          }}
        >
          <div
            className="animate-cube-spin relative will-change-transform [transform-style:preserve-3d]"
            style={
              { '--size': 'var(--cube)', width: 'var(--cube)', height: 'var(--cube)' } as CSSProperties
            }
          >
            <CubeFaces tone="accent" />

            <div
              className="animate-cube-spin-reverse absolute inset-[25%] [transform-style:preserve-3d]"
              style={{ '--size': 'calc(var(--cube) * 0.5)' } as CSSProperties}
            >
              <CubeFaces tone="accent-2" />
            </div>

            <span className="absolute top-1/2 left-1/2 size-3 -translate-1/2 rounded-full bg-accent-3 shadow-[0_0_24px_6px_color-mix(in_srgb,var(--accent-3)_55%,transparent)]" />
          </div>

          {/* Orbit rings, tilted in 3D so they pass through the cube. */}
          <div className="absolute inset-[4%] rounded-full border border-accent/25 [transform:rotateX(72deg)]" />
          <div className="absolute inset-[14%] rounded-full border border-accent-2/25 [transform:rotateY(72deg)_rotateZ(20deg)]" />
        </div>

        {/* Skills circling the object. Each label is counter-rotated to stay upright. */}
        <div className="animate-orbit pointer-events-none absolute inset-0 hidden md:block">
          {labels.map((name, index) => {
            const angle = (360 / labels.length) * index
            return (
              <div
                key={name}
                className="absolute top-1/2 left-1/2"
                style={{ transform: `rotate(${angle}deg) translateX(46cqw)` }}
              >
                <div style={{ transform: `rotate(${-angle}deg)` }}>
                  <div className="animate-orbit-reverse">
                    <span className="inline-block -translate-1/2 rounded-md border border-line bg-surface/80 px-2 py-1 font-mono text-[11px] whitespace-nowrap text-foreground backdrop-blur">
                      {name}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
