import { useRef, type CSSProperties } from 'react'
import { usePointerParallax } from '../../../hooks/usePointerParallax'

type AboutPortraitProps = {
  src: string
  alt: string
  className?: string
}

const shift = (x: number, y: number): CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * ${x}px), calc(var(--py, 0) * ${y}px), 0)`,
})

export function AboutPortrait({ src, alt, className = '' }: AboutPortraitProps) {
  const ref = useRef<HTMLDivElement>(null)
  usePointerParallax(ref)

  return (
    <div ref={ref} className={`group relative mx-auto w-full max-w-md lg:max-w-none ${className}`}>
      <div className="portrait-float relative">
        {/* Soft light behind the frame; it drifts the opposite way for a sense of depth. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_45%,transparent),transparent)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={shift(-14, -10)}
        />

        <div className="relative" style={shift(7, 5)}>
          {/* Offset corner brackets. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 -left-3 z-10 size-14 border-t-2 border-l-2 border-accent transition-transform duration-500 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -bottom-3 z-10 size-14 border-r-2 border-b-2 border-accent-3 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5"
          />

          {/* The frame: a 1px gradient border around the photo. */}
          <div className="rounded-2xl bg-linear-to-br from-accent via-accent-2/50 to-accent-3/70 p-px shadow-[0_2rem_5rem_-2rem_color-mix(in_srgb,var(--accent)_55%,transparent)] transition-shadow duration-500 group-hover:shadow-[0_2rem_6rem_-1.5rem_color-mix(in_srgb,var(--accent)_80%,transparent)]">
              <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-surface">
              {/* The photo is a transparent cut-out, so the themed backdrop shows around it. */}
              <div aria-hidden="true" className="portrait-backdrop absolute inset-0" />
              <img
                src={src}
                alt={alt}
                width={1024}
                height={1536}
                loading="lazy"
                decoding="async"
                className="relative aspect-[4/5] h-auto w-full [filter:drop-shadow(0_0_1.5rem_color-mix(in_srgb,var(--accent)_35%,transparent))] object-cover object-[50%_62%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10 ring-inset"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}