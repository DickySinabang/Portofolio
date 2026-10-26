import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Particle = { x: number; y: number; vx: number; vy: number }

const LINK_DISTANCE = 120
const POINTER_RADIUS = 160

/** Reads the current theme's accent color (e.g. #818cf8) as "r, g, b". */
function readAccentRgb(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim()
  const match = /^#([0-9a-f]{6})$/i.exec(value)
  if (!match) return '129, 140, 248'
  const n = parseInt(match[1], 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

/**
 * Decorative network of drifting dots. Nearby dots connect with lines, and the
 * cursor connects to and gently pushes dots away. Pauses when off-screen.
 */
export function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let frame = 0
    let running = false
    let inView = true
    let color = readAccentRgb()
    let particles: Particle[] = []
    const pointer = { x: -9999, y: -9999 }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const distance = Math.hypot(p.x - q.x, p.y - q.y)
          if (distance < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${color}, ${(1 - distance / LINK_DISTANCE) * 0.25})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        const pointerDistance = Math.hypot(p.x - pointer.x, p.y - pointer.y)
        if (pointerDistance < POINTER_RADIUS) {
          ctx.strokeStyle = `rgba(${color}, ${(1 - pointerDistance / POINTER_RADIUS) * 0.5})`
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }

        ctx.fillStyle = `rgba(${color}, 0.7)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const distance = Math.hypot(dx, dy)
        if (distance > 0 && distance < POINTER_RADIUS) {
          p.x += (dx / distance) * 0.6
          p.y += (dy / distance) * 0.6
        }

        if (p.x < 0) p.x = width
        else if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        else if (p.y > height) p.y = 0
      }
      draw()
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      frame = requestAnimationFrame(step)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const update = () => {
      if (inView && !document.hidden) start()
      else stop()
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

      const count = Math.min(90, Math.floor((width * height) / 14000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }))
      draw() // With reduced motion this single frame is all that is shown.
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }

    const onBlur = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    })
    intersectionObserver.observe(canvas)

    // Re-read the accent color whenever the theme class on <html> changes.
    const themeObserver = new MutationObserver(() => {
      color = readAccentRgb()
      if (!running) draw()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', update)

    resize()
    update()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', update)
    }
  }, [reduced])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}