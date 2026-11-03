import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { subscribeScroll } from '../../lib/scrollBus'

type Star = {
  x: number // 0 to 1 across the viewport
  y: number // 0 to 1 down the viewport
  radius: number
  depth: number // 0.2 (far, barely moves) to 1 (near)
  alpha: number
  phase: number
  speed: number
}

type Meteor = { x: number; y: number; vx: number; vy: number; age: number; life: number }

const FRAME_MS = 1000 / 30 // twinkling does not need more than 30 fps
const METEOR_TAIL = 150

/** Reads the current theme's star color (e.g. #dfe6ff) as "r, g, b". */
function readStarRgb(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--star').trim()
  const match = /^#([0-9a-f]{6})$/i.exec(value)
  if (!match) return '223, 230, 255'
  const n = parseInt(match[1], 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

/**
 * The star field behind the whole page: twinkling stars that drift slightly as
 * you scroll (nearer stars move more), and an occasional shooting star.
 * Decorative. With reduced motion it draws one still frame.
 *
 * (The file keeps its old name, ParticleField, so existing imports and the
 * tests that mock it keep working.)
 */
export function ParticleField({ className = 'fixed inset-0 size-full' }: { className?: string }) {
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
    let lastDraw = 0
    let color = readStarRgb()
    let stars: Star[] = []
    let meteor: Meteor | null = null
    let nextMeteorAt = performance.now() + 5000 + Math.random() * 5000

    const makeStars = () => {
      const count = Math.round(Math.min(Math.max((width * height) / 6500, 80), width < 640 ? 120 : 260))
      stars = Array.from({ length: count }, () => {
        const depth = 0.2 + Math.random() * 0.8
        return {
          x: Math.random(),
          y: Math.random(),
          radius: 0.4 + depth * (Math.random() < 0.06 ? 1.6 : 0.9),
          depth,
          alpha: 0.35 + depth * 0.55,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
        }
      })
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      const seconds = now / 1000
      const scroll = window.scrollY

      for (const star of stars) {
        const twinkle = reduced ? 0.85 : 0.55 + 0.45 * Math.sin(seconds * star.speed + star.phase)
        // Nearer stars slide up a little faster than far ones as the page scrolls.
        let y = star.y * height - scroll * star.depth * 0.1
        y = ((y % height) + height) % height
        ctx.fillStyle = `rgba(${color}, ${(star.alpha * twinkle).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(star.x * width, y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (meteor) {
        const progress = meteor.age / meteor.life
        const fade = Math.sin(progress * Math.PI) // in, then out
        const speed = Math.hypot(meteor.vx, meteor.vy)
        const tailX = meteor.x - (meteor.vx / speed) * METEOR_TAIL
        const tailY = meteor.y - (meteor.vy / speed) * METEOR_TAIL
        const gradient = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y)
        gradient.addColorStop(0, `rgba(${color}, 0)`)
        gradient.addColorStop(1, `rgba(${color}, ${(0.9 * fade).toFixed(3)})`)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(meteor.x, meteor.y)
        ctx.stroke()
      }
    }

    const step = (now: number) => {
      frame = requestAnimationFrame(step)
      const elapsed = now - lastDraw
      if (elapsed < FRAME_MS) return
      lastDraw = now

      if (meteor) {
        meteor.x += meteor.vx
        meteor.y += meteor.vy
        meteor.age += elapsed
        if (meteor.age >= meteor.life) meteor = null
      } else if (now > nextMeteorAt) {
        const angle = Math.PI * (0.14 + Math.random() * 0.12) // shallow, downward
        const speed = 14 + Math.random() * 6
        meteor = {
          x: width * (0.1 + Math.random() * 0.7),
          y: height * Math.random() * 0.4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: 900 + Math.random() * 400,
        }
        nextMeteorAt = now + 7000 + Math.random() * 9000
      }
      draw(now)
    }

    const update = () => {
      const shouldRun = !reduced && !document.hidden
      if (shouldRun && !running) {
        running = true
        frame = requestAnimationFrame(step)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(frame)
      }
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.5 : 2)
      const widthChanged = Math.abs(window.innerWidth - width) > 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      // Phones resize constantly as the address bar hides; keep the same stars then.
      if (widthChanged || stars.length === 0) makeStars()
      draw(performance.now())
    }

    const onScroll = () => {
      if (!running) draw(performance.now()) // reduced motion: keep the parallax honest
    }

    // Re-read the star color whenever the theme class on <html> changes.
    const themeObserver = new MutationObserver(() => {
      color = readStarRgb()
      if (!running) draw(performance.now())
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', update)

    resize()
    update()
    const unsubscribeScroll = subscribeScroll(onScroll)

    return () => {
      unsubscribeScroll()
      running = false
      cancelAnimationFrame(frame)
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', update)
    }
  }, [reduced])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
