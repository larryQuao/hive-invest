import { ArrowUp } from 'lucide-react'

/** Minimal single-row footer pinned to the bottom of the coming-soon screen. */
export function Footer() {
  return (
    <footer className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-8 text-sm text-black-40">
      <p>&copy; 2026 Hive Invest. All rights reserved.</p>
      <a
        href="#top"
        className="inline-flex items-center gap-1.5 font-semibold text-black-60 transition-colors hover:text-black-90"
      >
        Back to top
        <ArrowUp className="h-3.5 w-3.5" />
      </a>
    </footer>
  )
}
