import { useEffect } from 'react'
import type { RefObject } from 'react'
import { X } from 'lucide-react'
import { WaitlistForm } from './WaitlistForm'

interface WaitlistSheetProps {
  open: boolean
  onClose: () => void
  /** Ref to the email input so the sheet can focus it after sliding in. */
  inputRef: RefObject<HTMLInputElement | null>
}

/**
 * Waitlist form presented as a bottom sheet that slides up from the
 * bottom edge; the minimal, mobile-native pattern for this single-screen page.
 */
export function WaitlistSheet({ open, onClose, inputRef }: WaitlistSheetProps) {
  // Escape closes, and the email field receives focus once the slide finishes.
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 380)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [open, onClose, inputRef])

  // Lock background scrolling while the sheet is up.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black-90/25 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-sheet-title"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg rounded-t-[2.5rem] bg-white px-6 pb-10 shadow-[0_-24px_80px_-24px_rgba(17,118,249,0.25)] ring-1 ring-black-5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:px-10 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div aria-hidden className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-black-10" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-black-5 text-black-60 transition-colors hover:bg-black-10 hover:text-black-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-75"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mt-8 max-w-sm text-center">
          <h2 id="waitlist-sheet-title" className="text-2xl font-extrabold tracking-tight text-black-90">
            Be first in line
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-black-60">
            Join the waitlist and get early access to Hive Invest before we launch.
          </p>
          <div className="mt-7">
            <WaitlistForm inputRef={inputRef} />
            <p className="mt-4 text-xs font-medium tracking-wide text-black-40">
              Early access &middot; No spam, ever
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
