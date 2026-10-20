import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Global scroll-reveal + parallax animations driven by data attributes:
 *
 *   data-reveal              fade-up on scroll (default)
 *   data-reveal="left|right" slide in from a side
 *   data-reveal="scale"      scale + fade in
 *   data-reveal-delay="0.2"  seconds of extra delay
 *
 *   data-parallax="-80"      translates the element vertically (px) as it scrolls
 *   data-stagger             children with [data-stagger-item] reveal one by one
 */
export function useSiteAnimations() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const ctx = gsap.context(() => {
      // Individual scroll reveals
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const kind = el.dataset.reveal || 'up'
        const delay = parseFloat(el.dataset.revealDelay ?? '0')
        const from: gsap.TweenVars = { opacity: 0, delay, duration: 0.9, ease: 'power3.out' }
        if (kind === 'left') from.x = -48
        else if (kind === 'right') from.x = 48
        else if (kind === 'scale') {
          from.scale = 0.92
          from.y = 24
        } else from.y = 40

        gsap.from(el, {
          ...from,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      // Staggered groups
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const items = group.querySelectorAll('[data-stagger-item]')
        if (!items.length) return
        gsap.from(items, {
          opacity: 0,
          y: 48,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        })
      })

      // Parallax elements
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax ?? '-60')
        gsap.to(el, {
          y: amount,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
      })
    })

    return () => ctx.revert()
  }, [])
}
