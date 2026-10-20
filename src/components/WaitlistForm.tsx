import { useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { ArrowRight, Check } from 'lucide-react'

interface WaitlistFormProps {
  /** Optional ref to the email input so parents can focus it (e.g. when a sheet opens). */
  inputRef?: RefObject<HTMLInputElement | null>
}

/**
 * Minimal single-field waitlist capture.
 * Success state is client-side only; no backend wired up yet.
 */
export function WaitlistForm({ inputRef }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="inline-flex max-w-full flex-wrap items-center justify-center gap-2.5 rounded-full border border-primary-30 bg-white/80 px-5 py-3 text-sm font-semibold text-black-90 shadow-lg shadow-primary-10/60 backdrop-blur">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
        <span>
          You&rsquo;re on the list. We&rsquo;ll email <span className="font-bold">{email}</span> at
          launch.
        </span>
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto flex w-full max-w-md items-center">
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <input
        ref={inputRef}
        id="waitlist-email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        className="h-14 w-full rounded-full border border-black-10 bg-white/80 pr-16 pl-6 text-sm text-black-90 shadow-xl shadow-black-5/60 backdrop-blur transition placeholder:text-black-40 focus:border-primary-75 focus:ring-2 focus:ring-primary-100/30 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Join the waitlist"
        className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-white shadow-lg shadow-primary-100/40 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-75 focus-visible:ring-offset-2"
      >
        <ArrowRight className="h-4.5 w-4.5" />
      </button>
    </form>
  )
}
