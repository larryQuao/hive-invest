import { useState } from 'react'
import type { MouseEvent } from 'react'
import hiveInvestLogoUrl from '../assets/hiveinvestlogo.png'

const MAX_TILT_X = 14 // deg, responds to vertical pointer position
const MAX_TILT_Y = 20 // deg, responds to horizontal pointer position

/**
 * Minimal navbar: just the Hive Invest mark, centered, with a 3D feel:
 * idle float animation, a soft floor shadow, and a tilt that follows the
 * pointer across the logo (perspective rotateX/rotateY).
 */
export function Navbar() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -py * MAX_TILT_X, y: px * MAX_TILT_Y })
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-center px-4 sm:px-6">
        <a
          href="#top"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="group relative"
          aria-label="Hive Invest, back to top"
        >
          {/* floor shadow, breathes opposite the float */}
          <span
            aria-hidden
            className="absolute inset-x-2 -bottom-2 h-2 rounded-full bg-black-90/25 blur-[4px] animate-logo-shadow motion-reduce:animate-none"
          />
          <span className="block [perspective:600px] animate-logo-float motion-reduce:animate-none">
            <img
              src={hiveInvestLogoUrl}
              alt="Hive Invest logo"
              className="h-12 w-12 rounded-2xl object-cover shadow-[0_20px_36px_-12px_rgba(17,118,249,0.55)] ring-1 ring-black-5 transition-transform duration-150 ease-out will-change-transform sm:h-14 sm:w-14"
              style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            />
          </span>
        </a>
      </div>
    </header>
  )
}
