import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'

/**
 * Minimal Three.js backdrop for the coming-soon page:
 * a floating honeycomb lattice (on-brand for "Hive") with a gentle
 * breathing ripple, corner dots, ambient particles and pointer parallax.
 *
 * Vanilla three.js behind a tiny create/dispose API so React only
 * manages the container element.
 */

/* Brand palette (mirrors the tokens in src/index.css) */
const COLOR_CENTER = new Color('#1176F9') // primary-100
const COLOR_EDGE = new Color('#B6DBF6') // primary-30
const COLOR_DOTS = '#47A3E9' // primary-75
const COLOR_PARTICLES = '#84C1EF' // primary-50
const COLOR_BACKGROUND = new Color('#FAFBFD') // page canvas, used to dissolve edges

const RINGS = 5 // honeycomb radius in cells → 91 cells
const HEX_RADIUS = 0.85 // world units per cell
const RIPPLE_AMPLITUDE = 0.32
const RIPPLE_WAVELENGTH = 1.35
const RIPPLE_SPEED = 0.7

const PARTICLE_COUNT = 130
const MAX_PIXEL_RATIO = 2

/* Base tilt of the honeycomb plane; parallax offsets are applied on top */
const BASE_ROTATION_X = -0.58
const BASE_ROTATION_Y = 0.38

interface HexCell {
  /** offset of the first line vertex belonging to this cell */
  lineStart: number
  /** offset of the first point vertex belonging to this cell */
  pointStart: number
  /** normalised distance from the lattice centre (0 = centre, 1 = rim) */
  distance: number
}

/** Soft round sprite so particles render as dots instead of squares. */
function createDotTexture(): CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }
  return new CanvasTexture(canvas)
}

/** Builds the merged honeycomb buffers: line segments + corner dots. */
function createLattice() {
  const cells: HexCell[] = []

  // Axial coordinates for a hexagonal grid of the given radius.
  const axials: Array<{ q: number; r: number }> = []
  for (let q = -RINGS; q <= RINGS; q += 1) {
    for (let r = Math.max(-RINGS, -q - RINGS); r <= Math.min(RINGS, -q + RINGS); r += 1) {
      axials.push({ q, r })
    }
  }

  const linePositions = new Float32Array(axials.length * 6 * 2 * 3)
  const pointPositions = new Float32Array(axials.length * 6 * 3)
  const lineColors = new Float32Array(linePositions.length)

  const cornerX: number[] = []
  const cornerY: number[] = []
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i // flat-top hexagon corners
    cornerX.push(Math.cos(angle) * HEX_RADIUS)
    cornerY.push(Math.sin(angle) * HEX_RADIUS)
  }

  axials.forEach(({ q, r }, cellIndex) => {
    const centerX = HEX_RADIUS * 1.5 * q
    const centerY = HEX_RADIUS * Math.sqrt(3) * (r + q / 2)
    const maxDistance = Math.hypot(HEX_RADIUS * 1.5 * RINGS, 0)
    const distance = Math.min(1, Math.hypot(centerX, centerY) / maxDistance)

    // Colour dissolves from the brand blue at the centre into the page background.
    const tint = COLOR_CENTER.clone().lerp(COLOR_EDGE, Math.min(1, distance * 1.15))
    tint.lerp(COLOR_BACKGROUND, Math.max(0, distance - 0.55) * 0.9)

    const lineStart = cellIndex * 12 // 6 segments × 2 vertices, in vertex units
    const pointStart = cellIndex * 6

    for (let i = 0; i < 6; i += 1) {
      const next = (i + 1) % 6

      const ax = centerX + cornerX[i]
      const ay = centerY + cornerY[i]
      const bx = centerX + cornerX[next]
      const by = centerY + cornerY[next]

      const lineOffset = (lineStart + i * 2) * 3
      linePositions[lineOffset] = ax
      linePositions[lineOffset + 1] = ay
      linePositions[lineOffset + 2] = 0
      linePositions[lineOffset + 3] = bx
      linePositions[lineOffset + 4] = by
      linePositions[lineOffset + 5] = 0

      for (const offset of [lineOffset, lineOffset + 3]) {
        lineColors[offset] = tint.r
        lineColors[offset + 1] = tint.g
        lineColors[offset + 2] = tint.b
      }

      const pointOffset = (pointStart + i) * 3
      pointPositions[pointOffset] = ax
      pointPositions[pointOffset + 1] = ay
      pointPositions[pointOffset + 2] = 0
    }

    cells.push({ lineStart, pointStart, distance })
  })

  const lineGeometry = new BufferGeometry()
  lineGeometry.setAttribute('position', new BufferAttribute(linePositions, 3))
  lineGeometry.setAttribute('color', new BufferAttribute(lineColors, 3))

  const pointGeometry = new BufferGeometry()
  pointGeometry.setAttribute('position', new BufferAttribute(pointPositions, 3))

  return { cells, lineGeometry, pointGeometry }
}

/** Animates the shared "breathing" ripple across every cell. */
function updateRipple(cells: HexCell[], lineGeometry: BufferGeometry, pointGeometry: BufferGeometry, time: number) {
  const linePositions = lineGeometry.getAttribute('position') as BufferAttribute
  const pointPositions = pointGeometry.getAttribute('position') as BufferAttribute
  const lineArray = linePositions.array as Float32Array
  const pointArray = pointPositions.array as Float32Array

  for (const cell of cells) {
    const z = Math.sin(cell.distance * RIPPLE_WAVELENGTH - time * RIPPLE_SPEED) * RIPPLE_AMPLITUDE
    for (let v = 0; v < 12; v += 1) {
      lineArray[(cell.lineStart + v) * 3 + 2] = z
    }
    for (let v = 0; v < 6; v += 1) {
      pointArray[(cell.pointStart + v) * 3 + 2] = z
    }
  }

  linePositions.needsUpdate = true
  pointPositions.needsUpdate = true
}

function createParticles(dotTexture: CanvasTexture) {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const speeds = new Float32Array(PARTICLE_COUNT)

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14
    positions[i * 3 + 2] = -5 + Math.random() * 7
    speeds[i] = 0.12 + Math.random() * 0.25
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))

  const material = new PointsMaterial({
    color: COLOR_PARTICLES,
    size: 0.09,
    map: dotTexture,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    sizeAttenuation: true,
  })

  return { geometry, material, positions, speeds }
}

export interface HiveSceneHandle {
  dispose: () => void
}

export function createHiveScene(container: HTMLElement): HiveSceneHandle {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new Scene()
  const camera = new PerspectiveCamera(40, 1, 0.1, 100)
  camera.position.z = 11.5

  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    // WebGL unavailable; the page gradient alone still reads as intentional.
    return { dispose: () => {} }
  }
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO))
  const element = renderer.domElement
  element.style.width = '100%'
  element.style.height = '100%'
  element.style.display = 'block'
  // Defensive: drop any stale canvas left behind by a hot remount.
  container.querySelectorAll('canvas').forEach((canvas) => canvas.remove())
  container.appendChild(element)

  const dotTexture = createDotTexture()
  const { cells, lineGeometry, pointGeometry } = createLattice()

  const lines = new LineSegments(
    lineGeometry,
    new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.65 }),
  )

  const dots = new Points(
    pointGeometry,
    new PointsMaterial({
      color: COLOR_DOTS,
      size: 0.07,
      map: dotTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  )

  const hive = new Group()
  hive.add(lines, dots)
  hive.rotation.set(BASE_ROTATION_X, BASE_ROTATION_Y, 0)
  scene.add(hive)

  const particles = createParticles(dotTexture)
  const particlePoints = new Points(particles.geometry, particles.material)
  scene.add(particlePoints)

  /* --- sizing ---------------------------------------------------------- */

  function resize() {
    const width = container.clientWidth
    const height = container.clientHeight
    if (width === 0 || height === 0) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    if (reduceMotion) renderStatic()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  /* --- interaction ------------------------------------------------------ */

  const pointer = { x: 0, y: 0 }
  const pointerTarget = { x: 0, y: 0 }

  function handlePointerMove(event: PointerEvent) {
    pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1
    pointerTarget.y = (event.clientY / window.innerHeight) * 2 - 1
  }

  if (!reduceMotion) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
  }

  /* --- render loop ------------------------------------------------------ */

  function renderFrame(time: number, delta: number) {
    updateRipple(cells, lineGeometry, pointGeometry, time)

    // Pointer parallax with soft easing, plus a slow idle drift.
    pointer.x += (pointerTarget.x - pointer.x) * 0.04
    pointer.y += (pointerTarget.y - pointer.y) * 0.04
    hive.rotation.x = BASE_ROTATION_X + pointer.y * 0.06 + Math.sin(time * 0.1) * 0.03
    hive.rotation.y = BASE_ROTATION_Y + pointer.x * 0.09 + Math.cos(time * 0.13) * 0.04
    hive.position.y = pointer.y * -0.25

    // Ambient particles drift upwards and wrap around.
    const positions = particlePoints.geometry.getAttribute('position') as BufferAttribute
    const array = positions.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      array[i * 3 + 1] += particles.speeds[i] * delta
      if (array[i * 3 + 1] > 8) array[i * 3 + 1] = -8
    }
    positions.needsUpdate = true

    renderer.render(scene, camera)
  }

  function renderStatic() {
    updateRipple(cells, lineGeometry, pointGeometry, 0)
    renderer.render(scene, camera)
  }

  let frameId = 0
  let elapsed = 0
  let lastTime = performance.now()
  let running = false

  function tick(now: number) {
    const delta = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now
    elapsed += delta
    renderFrame(elapsed, delta)
    frameId = requestAnimationFrame(tick)
  }

  function startLoop() {
    if (running || reduceMotion) return
    running = true
    lastTime = performance.now()
    frameId = requestAnimationFrame(tick)
  }

  function stopLoop() {
    running = false
    cancelAnimationFrame(frameId)
  }

  function handleVisibilityChange() {
    if (document.hidden) stopLoop()
    else startLoop()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  if (reduceMotion) renderStatic()
  else startLoop()

  /* --- teardown --------------------------------------------------------- */

  function dispose() {
    stopLoop()
    resizeObserver.disconnect()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('pointermove', handlePointerMove)
    scene.traverse((object) => {
      if (object instanceof LineSegments || object instanceof Points) {
        object.geometry.dispose()
        const material = object.material
        if (Array.isArray(material)) material.forEach((m) => m.dispose())
        else material.dispose()
      }
    })
    dotTexture.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }

  return { dispose }
}
