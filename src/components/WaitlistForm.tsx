import { useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { countryCodes } from '../lib/countryCodes'

interface WaitlistFormProps {
  /** Optional ref to the email input so parents can focus it (e.g. when a sheet opens). */
  inputRef?: RefObject<HTMLInputElement | null>
}

const fieldClasses =
  'w-full rounded-2xl border border-black-10 bg-white px-4 py-3 text-sm text-black-90 shadow-sm transition placeholder:text-black-40 focus:border-primary-75 focus:ring-2 focus:ring-primary-100/30 focus:outline-none'

const DEFAULT_COUNTRY_CODE = '+233' // Ghana

/**
 * Waitlist capture: full name, email and phone (with country code picker).
 * Success state is client-side only; no backend wired up yet.
 */
export function WaitlistForm({ inputRef }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="inline-flex max-w-full flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-primary-30 bg-white/80 px-5 py-4 text-sm font-semibold text-black-90 shadow-lg shadow-primary-10/60 backdrop-blur">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
        <span>
          You&rsquo;re on the list. We&rsquo;ll reach out to <span className="font-bold">{email}</span> or{' '}
          <span className="font-bold">
            {countryCode} {phone}
          </span>{' '}
          at launch.
        </span>
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm space-y-4 text-left">
      <div>
        <label htmlFor="waitlist-name" className="mb-1.5 block text-sm font-semibold text-black-70">
          Full name
        </label>
        <input
          id="waitlist-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Jane Doe"
          className={fieldClasses}
        />
      </div>
      <div>
        <label htmlFor="waitlist-email" className="mb-1.5 block text-sm font-semibold text-black-70">
          Email address
        </label>
        <input
          ref={inputRef}
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jane@example.com"
          className={fieldClasses}
        />
      </div>
      <div>
        <label htmlFor="waitlist-phone" className="mb-1.5 block text-sm font-semibold text-black-70">
          Phone number
        </label>
        <div className="flex overflow-hidden rounded-2xl border border-black-10 bg-white shadow-sm transition focus-within:border-primary-75 focus-within:ring-2 focus-within:ring-primary-100/30">
          <div className="relative flex shrink-0 items-center border-r border-black-10">
            <select
              id="waitlist-country-code"
              name="countryCode"
              aria-label="Country code"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className="h-full appearance-none bg-transparent py-3 pl-4 pr-9 text-sm font-semibold text-black-90 focus:outline-none"
            >
              {countryCodes.map((country) => (
                <option key={country.iso} value={country.code}>
                  {country.iso} {country.code}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-black-40" />
          </div>
          <input
            id="waitlist-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel-national"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="24 130 2496"
            className="w-full border-0 bg-transparent px-4 py-3 text-sm text-black-90 placeholder:text-black-40 focus:outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary-100 text-sm font-bold text-white shadow-lg shadow-primary-100/40 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-75 focus-visible:ring-offset-2"
      >
        Join the Waitlist
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  )
}
