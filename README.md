# Hive Invest — Coming Soon Landing Page

A single-page React app announcing Hive Invest before launch. Visitors can learn what's coming and join the waitlist via the form at the bottom of the page.

Built with Vite, React, Tailwind CSS v4, GSAP scroll animations, and Lucide icons.

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check with `tsc -b`, then build to `dist/`
- `npm run preview` — serve the built output locally
- `npm run lint` — run oxlint

## Project Structure

- `src/components/Navbar.tsx` — fixed navbar with the waitlist call-to-action
- `src/components/Hero.tsx` — coming-soon hero with "Join the Waitlist" button (scrolls to `#waitlist`)
- `src/components/ComingSoon.tsx` — dark teaser section with what's launching
- `src/components/Waitlist.tsx` — waitlist form (`#waitlist`) with a client-side success state
- `src/components/Footer.tsx` — minimal footer
- `src/lib/useSiteAnimations.ts` — shared GSAP ScrollTrigger hook driven by `data-reveal` / `data-stagger` attributes

> Note: the waitlist form currently has no backend — submissions only show a confirmation in the browser. Wire `handleSubmit` in `Waitlist.tsx` to your API or form service when ready.
