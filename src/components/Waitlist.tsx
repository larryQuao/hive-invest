import { useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Send } from 'lucide-react'

const inputClasses =
  'w-full rounded-xl border-0 bg-black-80 px-4 py-3 text-sm text-white placeholder:text-black-50 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-primary-100'

export function Waitlist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="waitlist" className="scroll-mt-24 px-4 pb-24">
      <div
        data-reveal
        className="mx-auto max-w-2xl rounded-[2.5rem] bg-black-90 px-6 py-16 text-center sm:px-12"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Be first in line
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-black-40">
          Join the waitlist and get early access to Hive Invest before we launch.
        </p>
        {submitted ? (
          <div className="mt-10 rounded-2xl bg-black-80 p-6 ring-1 ring-white/10">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary-75" />
            <p className="mt-4 text-lg font-bold text-white">You&rsquo;re on the list!</p>
            <p className="mt-1 text-sm text-black-40">
              We&rsquo;ll reach out to <span className="font-semibold text-white">{email}</span> as
              soon as Hive Invest launches.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md space-y-4 text-left">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-black-20">
                Full name
              </label>
              <input id="name" name="name" type="text" required placeholder="Jane Doe" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-black-20">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@example.com"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="interest" className="mb-1.5 block text-sm font-semibold text-black-20">
                I&rsquo;m interested in
              </label>
              <select id="interest" name="interest" className={inputClasses} defaultValue="Investing in properties">
                <option>Investing in properties</option>
                <option>Getting funding for a project</option>
                <option>Both</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-100 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary-100/30 transition-transform hover:scale-[1.02]"
            >
              Join the Waitlist
              <Send className="h-5 w-5" />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
