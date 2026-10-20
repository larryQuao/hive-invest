import { ArrowDown } from 'lucide-react'

/**
 * Single-screen hero for the minimal coming-soon page.
 * The Three.js honeycomb backdrop (SceneCanvas) lives behind this content;
 * the waitlist form itself slides up from the bottom (WaitlistSheet).
 */
export function Hero({ onJoin }: { onJoin: () => void }) {
  return (
    <section
      id="top"
      className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-32 text-center"
    >
      {/* faint glow to lift the copy off the lattice */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[30rem] w-[60rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-10/70 blur-3xl"
      />

      <div className="relative">
        <span
          data-reveal
          className="inline-flex items-center gap-2 rounded-full border border-primary-30/70 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary-100 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-100 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-100" />
          </span>
          Coming Soon
        </span>

        <h1
          data-reveal
          data-reveal-delay="0.08"
          className="mx-auto mt-8 max-w-4xl text-5xl font-extrabold tracking-tight text-black-90 sm:text-7xl"
        >
          Real estate investing, <span className="block text-primary-100">simplified.</span>
        </h1>

        <p
          data-reveal
          data-reveal-delay="0.16"
          className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-black-60"
        >
          Hive Invest is almost here. Back vetted property deals or raise funding for your next
          project. All in one hive.
        </p>

        <div data-reveal data-reveal-delay="0.24" className="mt-10">
          <button
            type="button"
            onClick={onJoin}
            className="inline-flex items-center gap-2.5 rounded-full bg-primary-100 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-100/30 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-75 focus-visible:ring-offset-2"
          >
            Join the Waitlist
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
