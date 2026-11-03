import { useEffect, useRef } from 'react'
import {
  BackSide,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three'
import {
  FOV_DEGREES,
  SECTION_IDS,
  adaptPose,
  damp,
  heroAnchorY,
  heroDistance,
  normalizeTops,
  remapProgress,
  samplePose,
  sectionProgress,
} from '../../lib/earthJourney'
import { ORBITS } from '../../lib/planet'
import { subscribeScroll } from '../../lib/scrollBus'

/*
 * The Earth, one persistent WebGL scene behind the whole page.
 *
 * The planet is drawn from real NASA imagery (public/textures/earth): the daytime surface,
 * the city lights of the night side, an ocean mask for the sun's glitter, and cloud cover.
 * Shaders add the lighting, the glow of the atmosphere and the soft blush where day turns
 * to night. The scroll position is turned into a position along the camera journey
 * (lib/earthJourney.ts): the camera orbits and retreats, the Earth turns and shrinks, and the
 * light shifts. This file is loaded lazily, so Three.js is never part of the initial bundle.
 */

/** An average gap between frames above this (ms), about 15 fps, means no real GPU. */
const SLOW_FRAME_MS = 65
/** One frame gap this long (ms), after the first few, means the scene is unusable here. */
const VERY_SLOW_FRAME_MS = 400
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i
const IDLE_FRAME_MS = 1000 / 30 // when the page is not scrolling, 30 fps is plenty
/** Which longitude faces the camera at the start: Southeast Asia, near the visitor's home. */
const BASE_SPIN = -3.3

const noiseGlsl = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      sum += amp * noise(p);
      p = p * 2.02 + vec3(1.7, 9.2, 3.1);
      amp *= 0.5;
    }
    return sum * 1.0667;
  }
`

const surfaceVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vObj;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vObj = position;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const earthFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uDay;
  uniform sampler2D uLights;
  uniform sampler2D uWater;
  uniform vec3 uLight;
  uniform float uGlow;
  varying vec2 vUv;
  varying vec3 vObj;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  ${noiseGlsl}

  void main() {
    vec3 p = normalize(vObj);
    vec3 day = texture2D(uDay, vUv).rgb;
    float water = texture2D(uWater, vUv).r; // 1 over the ocean, 0 over land
    vec3 lights = texture2D(uLights, vUv).rgb;

    // Grade the picture: deep, moody oceans with a little life in them; land a touch darker
    // and richer, so the clouds and the glow stand out against it.
    float swell = fbm(p * 5.0);
    vec3 deepOcean = vec3(0.01, 0.06, 0.22);
    vec3 brightOcean = vec3(0.05, 0.3, 0.6);
    vec3 ocean = mix(deepOcean, brightOcean, 0.25 + 0.75 * smoothstep(0.25, 0.75, swell));
    vec3 land = pow(day, vec3(1.15)) * vec3(0.95, 0.98, 1.0);
    float oceanMask = smoothstep(0.35, 0.65, water);
    vec3 color = mix(land, ocean, oceanMask);

    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uLight);
    float ndl = dot(N, L);

    float diffuse = smoothstep(-0.08, 0.85, ndl);
    vec3 lit = color * (0.02 + diffuse * 1.2);

    // Sunlight glittering on the ocean.
    vec3 R = reflect(-L, N);
    float glint = pow(max(dot(R, V), 0.0), 60.0) * oceanMask * smoothstep(0.0, 0.3, ndl);
    lit += vec3(0.7, 0.88, 1.0) * glint * 0.8;

    // City lights on the night side.
    float night = 1.0 - smoothstep(-0.14, 0.08, ndl);
    lit += vec3(1.0, 0.8, 0.5) * lights * night * 1.7;

    // A soft violet-blue blush where day turns to night.
    float terminator = smoothstep(-0.2, 0.03, ndl) * (1.0 - smoothstep(0.03, 0.4, ndl));
    lit += vec3(0.35, 0.3, 0.85) * terminator * 0.2;

    // Blue-cyan atmosphere hugging the edge of the disc, strongest toward the sun.
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);
    lit += vec3(0.25, 0.62, 1.0) * fresnel * (0.2 + 0.8 * smoothstep(-0.3, 0.5, ndl)) * 1.1 * uGlow;

    gl_FragColor = vec4(lit, 1.0);
  }
`

const cloudFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uClouds;
  uniform float uTime;
  uniform vec3 uLight;
  varying vec2 vUv;
  varying vec3 vObj;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  ${noiseGlsl}

  void main() {
    vec3 p = normalize(vObj);
    float cover = texture2D(uClouds, vUv).r;
    // Break the cloud deck up a little at close range, and let it drift.
    float detail = fbm(p * 9.0 + vec3(uTime * 0.01, 0.0, 0.0));
    float density = smoothstep(0.12, 0.85, cover) * (0.7 + 0.5 * detail);

    vec3 N = normalize(vWorldNormal);
    float ndl = dot(N, normalize(uLight));
    float lit = smoothstep(-0.12, 0.75, ndl);

    vec3 color = vec3(0.95, 0.97, 1.0) * (0.03 + 1.15 * lit);
    color += vec3(0.4, 0.35, 0.8) * smoothstep(-0.2, 0.0, ndl) * (1.0 - smoothstep(0.0, 0.3, ndl)) * 0.15;
    float alpha = clamp(density, 0.0, 1.0) * (0.12 + 0.8 * lit);
    gl_FragColor = vec4(color, alpha);
  }
`

const glowVertex = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vWorldNormal;
  void main() {
    vViewNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// A slightly larger sphere seen from the inside (BackSide): the scattered light around the
// planet. Its alpha fades to zero at its own silhouette, so it has no hard edge.
const glowFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uLight;
  uniform float uGlow;
  varying vec3 vViewNormal;
  varying vec3 vWorldNormal;
  void main() {
    float depth = max(-vViewNormal.z, 0.0);
    float lit = 0.3 + 0.7 * smoothstep(-0.5, 0.6, dot(normalize(vWorldNormal), normalize(uLight)));
    float alpha = clamp(pow(depth, 1.35) * 2.6 * lit * uGlow, 0.0, 1.0);
    vec3 color = mix(vec3(0.16, 0.45, 1.0), vec3(0.4, 0.82, 1.0), pow(depth, 0.8));
    gl_FragColor = vec4(color, alpha);
  }
`

type EarthSceneProps = {
  onReady: () => void
  onFail: () => void
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

const TEXTURES = {
  day: 'earth-day.jpg',
  clouds: 'earth-clouds.jpg',
  water: 'earth-water.jpg',
  lights: 'earth-lights.jpg',
} as const

export default function EarthScene({ onReady, onFail }: EarthSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const callbacks = useRef({ onReady, onFail })

  useEffect(() => {
    callbacks.current = { onReady, onFail }
  })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    // The canvas is created here (not in JSX) so a remount always gets a fresh WebGL
    // context; a context that was force-lost cannot be reused.
    const canvas = document.createElement('canvas')
    canvas.className = 'size-full'
    host.appendChild(canvas)

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        // On a device with no real GPU this throws, and the page keeps the CSS planet.
        failIfMajorPerformanceCaveat: true,
      })
    } catch {
      canvas.remove()
      callbacks.current.onFail()
      return
    }

    // Software renderers run this scene at a few frames per second. Detect them up front.
    const gl = renderer.getContext()
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const rendererName = debugInfo ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) : ''
    if (SOFTWARE_RENDERER.test(rendererName)) {
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
      callbacks.current.onFail()
      return
    }

    let disposed = false
    let teardown: (() => void) | null = null
    const textures: Texture[] = []

    // Load the imagery first; the scene starts only when all of it is there.
    const loader = new TextureLoader()
    const base = import.meta.env.BASE_URL
    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    const load = (file: string) =>
      loader.loadAsync(`${base}textures/earth/${file}`).then((texture) => {
        texture.anisotropy = anisotropy
        textures.push(texture)
        return texture
      })

    Promise.all([load(TEXTURES.day), load(TEXTURES.clouds), load(TEXTURES.water), load(TEXTURES.lights)])
      .then(([day, clouds, water, lights]) => {
        if (disposed) return
        teardown = start(day, clouds, water, lights)
      })
      .catch(() => {
        if (!disposed) callbacks.current.onFail()
      })

    function start(day: Texture, clouds: Texture, water: Texture, lights: Texture) {
      const scene = new Scene()
      const camera = new PerspectiveCamera(FOV_DEGREES, 1, 0.1, 250)

      const disposables: { dispose: () => void }[] = []
      const track = <T extends { dispose: () => void }>(item: T): T => {
        disposables.push(item)
        return item
      }

      // ---------- Light and shared uniforms ----------
      const light = new Vector3(0.8, 0.4, 0.45)
      const shared = {
        uTime: { value: 0 },
        uLight: { value: light },
        uGlow: { value: 1 },
      }

      // ---------- The Earth ----------
      const world = new Group() // scaled with the journey
      scene.add(world)
      const tilt = new Group()
      tilt.rotation.z = 0.2 // axial tilt, eased from the real 23.4 degrees so the picture stays upright
      world.add(tilt)

      const earth = new Mesh(
        track(new SphereGeometry(1, 160, 120)),
        track(
          new ShaderMaterial({
            uniforms: { ...shared, uDay: { value: day }, uLights: { value: lights }, uWater: { value: water } },
            vertexShader: surfaceVertex,
            fragmentShader: earthFragment,
          }),
        ),
      )
      tilt.add(earth)

      const cloudLayer = new Mesh(
        track(new SphereGeometry(1.008, 128, 96)),
        track(
          new ShaderMaterial({
            uniforms: { ...shared, uClouds: { value: clouds } },
            vertexShader: surfaceVertex,
            fragmentShader: cloudFragment,
            transparent: true,
            depthWrite: false,
          }),
        ),
      )
      tilt.add(cloudLayer)

      const atmosphere = new Mesh(
        track(new SphereGeometry(1.1, 96, 64)),
        track(
          new ShaderMaterial({
            uniforms: shared,
            vertexShader: glowVertex,
            fragmentShader: glowFragment,
            side: BackSide,
            transparent: true,
            depthWrite: false,
          }),
        ),
      )
      atmosphere.renderOrder = 2
      world.add(atmosphere)

      // ---------- Orbit rings ----------
      const ringPoints: number[] = []
      for (let i = 0; i < 180; i++) {
        const angle = (i / 180) * Math.PI * 2
        ringPoints.push(Math.cos(angle), 0, Math.sin(angle))
      }
      const ringGeometry = track(new BufferGeometry())
      ringGeometry.setAttribute('position', new Float32BufferAttribute(ringPoints, 3))

      const ringMaterials: LineBasicMaterial[] = []
      const ringGroups = ORBITS.map((orbit) => {
        const roll = new Group()
        roll.rotation.z = orbit.roll
        const pitch = new Group()
        pitch.rotation.x = orbit.tilt
        roll.add(pitch)
        const material = track(new LineBasicMaterial({ color: 0x7cb4ff, transparent: true, opacity: orbit.opacity }))
        ringMaterials.push(material)
        const ring = new LineLoop(ringGeometry, material)
        ring.scale.setScalar(orbit.radius)
        pitch.add(ring)
        world.add(roll)
        return roll
      })

      // ---------- Orbital dust: a thin disc of tiny grains around the planet ----------
      const dustPositions: number[] = []
      for (let i = 0; i < 520; i++) {
        const radius = 1.35 + Math.pow(Math.random(), 1.5) * 1.5
        const angle = Math.random() * Math.PI * 2
        dustPositions.push(Math.cos(angle) * radius, (Math.random() - 0.5) * 0.1 * (radius - 1), Math.sin(angle) * radius)
      }
      const dustGeometry = track(new BufferGeometry())
      dustGeometry.setAttribute('position', new Float32BufferAttribute(dustPositions, 3))
      const dustMaterial = track(
        new PointsMaterial({ color: 0x9bc0ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.6, depthWrite: false }),
      )
      const dust = new Points(dustGeometry, dustMaterial)
      dust.rotation.set(0.35, 0, -0.25)
      world.add(dust)

      // ---------- Distant stars: real depth, so the camera's swing makes them drift ----------
      const starPositions: number[] = []
      for (let i = 0; i < 380; i++) {
        const direction = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
        starPositions.push(...direction.multiplyScalar(70 + Math.random() * 60).toArray())
      }
      const starGeometry = track(new BufferGeometry())
      starGeometry.setAttribute('position', new Float32BufferAttribute(starPositions, 3))
      const starMaterial = track(
        new PointsMaterial({ color: 0xcfd8ff, size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0.7, depthWrite: false }),
      )
      scene.add(new Points(starGeometry, starMaterial))

      // ---------- Sizing ----------
      let width = 1
      let height = 1
      const resize = () => {
        width = host!.clientWidth
        height = host!.clientHeight
        if (!width || !height) return
        const maxRatio = width < 640 ? 1.5 : 1.75
        const budget = Math.sqrt(2.4e6 / (width * height)) // keep the pixel count in check on big screens
        renderer.setPixelRatio(Math.max(0.75, Math.min(window.devicePixelRatio || 1, maxRatio, budget)))
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }

      // ---------- Where each section starts (page offsets), kept up to date ----------
      let tops: number[] = [0, 1]
      let poseIndexes: number[] = [0, 1]
      // At the very end the Earth hangs beside the Contact heading, wherever the layout puts it.
      let finalAnchorY: number | null = null
      const measure = () => {
        const offsets: number[] = []
        const indexes: number[] = []
        SECTION_IDS.forEach((id, index) => {
          const element = document.getElementById(id)
          if (id === 'home') {
            offsets.push(0)
            indexes.push(index)
          } else if (element) {
            offsets.push(element.getBoundingClientRect().top + window.scrollY)
            indexes.push(index)
          }
        })
        poseIndexes = indexes
        const heading = document.getElementById('contact-heading')
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        tops = normalizeTops(offsets, maxScroll)
        if (heading) {
          const rect = heading.getBoundingClientRect()
          const pageMiddle = rect.top + window.scrollY + rect.height / 2
          const viewportY = pageMiddle - tops[tops.length - 1] // where it sits when the journey ends
          // A little above the heading's middle, so the whole planet clears the message panel.
          finalAnchorY = 1 - (2 * (viewportY - window.innerHeight * 0.03)) / window.innerHeight
        } else {
          finalAnchorY = null
        }
      }

      // ---------- Scroll, pointer ----------
      let scrollY = window.scrollY
      const journeyTarget = () => remapProgress(sectionProgress(scrollY, tops), poseIndexes)
      const unsubscribeScroll = subscribeScroll((y) => {
        scrollY = y
      })

      const lean = { x: 0, y: 0, tx: 0, ty: 0 }
      const finePointer = window.matchMedia('(pointer: fine)').matches
      const onPointerMove = (event: PointerEvent) => {
        lean.tx = (event.clientX / window.innerWidth) * 2 - 1
        lean.ty = (event.clientY / window.innerHeight) * 2 - 1
      }
      if (finePointer) window.addEventListener('pointermove', onPointerMove, { passive: true })

      // ---------- Frame ----------
      let journey = -1 // current position along the journey (smoothed); -1 = not placed yet
      let time = 0
      let last = 0
      let lastRender = 0
      let raf = 0
      let running = false
      let announced = false
      let shownOpacity = 0

      // Safety net for devices that have WebGL but no real GPU: if the first frames arrive
      // slowly, give up and keep the CSS planet. The first interval is skipped (shader compile).
      const gaps: number[] = []
      let previousFrame = 0
      let judged = false
      const checkSpeed = (now: number) => {
        if (judged) return
        if (previousFrame) gaps.push(now - previousFrame)
        previousFrame = now
        if (gaps.length >= 3 && gaps[gaps.length - 1] > VERY_SLOW_FRAME_MS) {
          judged = true
          callbacks.current.onFail()
          return
        }
        if (gaps.length < 7) return
        judged = true
        const average = gaps.slice(1).reduce((sum, value) => sum + value, 0) / (gaps.length - 1)
        if (average > SLOW_FRAME_MS) callbacks.current.onFail()
      }

      const draw = (now: number) => {
        const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
        last = now
        time += dt

        // Smooth the journey position, so fast scrolling or reversing never makes the camera jump.
        const target = journeyTarget()
        journey = journey < 0 ? target : damp(journey, target, 5.5, dt)
        const aspect = width / height
        const pose = adaptPose(samplePose(journey), aspect)

        // The intro is composed from the screen shape (a huge Earth, curve across the screen) and
        // eases into the regular journey over the first section.
        {
          const intro = 1 - smoothstep(0, 1, journey)
          pose.distance += (heroDistance(aspect) - pose.distance) * intro
          pose.anchorY += (heroAnchorY(aspect) - pose.anchorY) * intro
        }
        if (finalAnchorY !== null) {
          const arrival = smoothstep(4, 5, journey)
          pose.anchorY += (finalAnchorY - pose.anchorY) * arrival
        }

        // Camera: orbit the Earth, retreat, and shift the frame so the Earth sits at its anchor.
        const { distance, azimuth, elevation } = pose
        camera.position.set(
          distance * Math.cos(elevation) * Math.sin(azimuth),
          distance * Math.sin(elevation),
          distance * Math.cos(elevation) * Math.cos(azimuth),
        )
        camera.up.set(Math.sin(pose.roll), Math.cos(pose.roll), 0)
        camera.lookAt(0, 0, 0)
        camera.setViewOffset(width, height, (-pose.anchorX * width) / 2, (pose.anchorY * height) / 2, width, height)
        camera.updateMatrixWorld()

        // The Earth: scroll-linked spin plus a slow constant turn, and its own scale.
        lean.x += (lean.tx - lean.x) * 0.05
        lean.y += (lean.ty - lean.y) * 0.05
        world.scale.setScalar(pose.scale)
        world.rotation.set(lean.y * 0.03, lean.x * 0.04, 0)
        earth.rotation.y = BASE_SPIN + pose.spin + time * 0.012
        cloudLayer.rotation.y = BASE_SPIN + pose.spin * 1.06 + time * 0.016
        dust.rotation.y = time * 0.02

        // Light: defined relative to the camera, so the lit side stays graceful as the view swings.
        light.set(pose.sunX, pose.sunY, pose.sunZ).transformDirection(camera.matrixWorld)
        shared.uTime.value = time
        shared.uGlow.value = pose.glow
        ringMaterials.forEach((material, index) => {
          material.opacity = ORBITS[index].opacity * pose.rings
        })
        ringGroups.forEach((group) => {
          group.visible = pose.rings > 0.02
        })
        dustMaterial.opacity = 0.6 * pose.dust
        dust.visible = pose.dust > 0.02

        // On a tall, narrow screen the Earth sits behind the text: dim it, except at the end.
        if (announced) {
          const level = aspect < 0.8 ? 0.6 + 0.4 * smoothstep(4, 5, journey) : 1
          if (Math.abs(level - shownOpacity) > 0.02) {
            shownOpacity = level
            host!.style.opacity = level.toFixed(2)
          }
        }

        renderer.render(scene, camera)

        if (!announced) {
          announced = true
          shownOpacity = aspect < 0.8 ? 0.6 : 1
          host!.style.opacity = shownOpacity.toFixed(2)
          callbacks.current.onReady()
        }
        checkSpeed(now)
      }

      const loop = (now: number) => {
        raf = requestAnimationFrame(loop)
        // Resting on a section: render at 30 fps. While the page is moving: every frame.
        const moving = Math.abs(journeyTarget() - journey) > 0.0008
        if (!moving && announced && now - lastRender < IDLE_FRAME_MS) return
        lastRender = now
        draw(now)
      }

      const update = () => {
        const shouldRun = !document.hidden
        if (shouldRun && !running) {
          running = true
          last = 0
          previousFrame = 0
          raf = requestAnimationFrame(loop)
        } else if (!shouldRun && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      }

      const resizeObserver = new ResizeObserver(() => {
        resize()
        measure()
        if (!running) draw(performance.now())
      })
      resizeObserver.observe(host!)
      // The page's height changes as sections lay out (the pinned Skills track, fonts, images).
      const bodyObserver = new ResizeObserver(measure)
      bodyObserver.observe(document.body)

      document.addEventListener('visibilitychange', update)

      resize()
      measure()
      update()

      return () => {
        running = false
        cancelAnimationFrame(raf)
        resizeObserver.disconnect()
        bodyObserver.disconnect()
        unsubscribeScroll()
        window.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('visibilitychange', update)
        disposables.forEach((item) => item.dispose())
      }
    }

    const onContextLost = (event: Event) => {
      event.preventDefault()
      callbacks.current.onFail()
    }
    canvas.addEventListener('webglcontextlost', onContextLost)

    return () => {
      disposed = true
      teardown?.()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      textures.forEach((texture) => texture.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
  }, [])

  return <div ref={hostRef} className="absolute inset-0 opacity-0 transition-opacity duration-1000" />
}
