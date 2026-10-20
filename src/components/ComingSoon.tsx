import { Building2, HandCoins, LineChart } from 'lucide-react'

const items = [
  {
    icon: Building2,
    title: 'Invest in vetted properties',
    description:
      'Browse curated real estate opportunities and build your portfolio with confidence.',
  },
  {
    icon: HandCoins,
    title: 'Get funding for your project',
    description:
      'Property owners and developers can raise capital directly from a community of investors.',
  },
  {
    icon: LineChart,
    title: 'Track every return',
    description:
      'Monitor payments, returns and portfolio performance from one secure dashboard.',
  },
]

export function ComingSoon() {
  return (
    <section id="whats-coming" className="px-4 pb-24">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-black-90 px-6 py-20 sm:px-12">
        <h2
          data-reveal
          className="mx-auto max-w-2xl text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
        >
          What&rsquo;s coming to Hive Invest
        </h2>
        <p
          data-reveal
          data-reveal-delay="0.1"
          className="mx-auto mt-4 max-w-xl text-center leading-relaxed text-black-40"
        >
          We&rsquo;re building a platform where investors and property owners win together.
          Here&rsquo;s a taste of what&rsquo;s on the way.
        </p>
        <div data-stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              data-stagger-item
              className="rounded-3xl bg-black-80 p-6 ring-1 ring-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-primary-50 to-primary-100 text-white shadow-lg shadow-primary-100/30">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black-40">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
