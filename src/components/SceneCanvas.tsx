import { useEffect, useRef } from 'react'

/**
 * Full-viewport Three.js backdrop sitting behind the page content.
 * Pointer events pass through so the UI stays fully interactive.
 * The scene module is lazy-loaded and fades in once ready.
 */
export function SceneCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let handle: { dispose: () => void } | undefined

    import('../three/HiveScene').then(({ createHiveScene }) => {
      if (disposed) return
      container.classList.add('opacity-100')
      handle = createHiveScene(container)
    })

    return () => {
      disposed = true
      handle?.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-1000"
    />
  )
}
