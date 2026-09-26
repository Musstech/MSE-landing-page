import { Link } from 'react-router-dom'
import { Activity, ArrowRight, BatteryCharging, Cable, Calculator, CheckCircle2, Compass, FileText, Lock, Search, SunMedium } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Card } from '../components/ui/Card'
import { books } from '../data/books'

const freeItems = ['Load assessment', 'Panel sizing', 'Troubleshooting guide', 'Book library', 'Basic compass map check']

const premiumItems = [
  'Complete system sizing from one load entry',
  'Professional quotation generation',
  'Installer letterhead with company name and subtitle',
  'Editable equipment pricing',
  'Optional tax and bank details',
  'Battery sizing recommendations',
  'Inverter sizing from connected loads',
  'Cable and cost tools',
  'Print or save quotation as PDF',
  'Advanced project reports when added',
]

const quickActions = [
  { title: 'New Design', text: 'Start a full sizing workflow from load entry.', to: '/calculators?tab=load', icon: SunMedium },
  { title: 'Diagnose', text: 'Find fault checks quickly.', to: '/troubleshooting', icon: Search },
  { title: 'Quote', text: 'Prepare a client document.', to: '/quotation', icon: FileText },
  { title: 'Navigator', text: 'Check panel-facing direction.', to: '/navigator', icon: Compass },
]

const tools = [
  { title: 'Solar System', text: 'Complete load design', to: '/calculators?tab=load', icon: Calculator },
  { title: 'Solar Sizing', text: 'PV panel sizing', to: '/calculators?tab=panel', icon: SunMedium },
  { title: 'Battery Sizing', text: 'Night load bank', to: '/calculators?tab=battery', icon: BatteryCharging },
  { title: 'Inverter Sizing', text: 'Continuous and surge', to: '/calculators?tab=inverter', icon: Activity },
  { title: 'Cable Sizing', text: 'Cable checks', to: '/calculators?tab=cable', icon: Cable },
]

function ActionGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.title} to={item.to} className="group min-h-28 rounded-2xl border border-white/70 bg-white/60 p-3 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/75 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-sky-700 dark:text-sky-300" />
              <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500" />
            </div>
            <div className="mt-3 font-heading text-sm font-bold text-slate-950 dark:text-white">{item.title}</div>
            <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.text}</div>
          </Link>
        )
      })}
    </div>
  )
}

export function HomePage() {
  const { isPremium, planName, subscriptionActive } = useSubscription()
  const featuredBooks = books.slice(0, 5)

  return (
    <div className="space-y-5">
      <section className="ios-card relative overflow-hidden p-6 sm:p-8">
        <h2 className="font-heading text-3xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-4xl">Welcome back to your workspace.</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
          Plan solar loads, size core components, diagnose field issues, and prepare documents your clients can understand.
        </p>
        <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-slate-200">
          <span>Plan: {planName}</span>
          {isPremium ? <span className="text-sky-600 dark:text-sky-300">Status: {subscriptionActive ? 'Active' : 'Inactive'}</span> : <span className="text-slate-500">Professional tools are available with Premium.</span>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/25" to="/calculators?tab=load">
            <Calculator className="h-4 w-4" />
            Start a Calculation
          </Link>
          <Link className="inline-flex min-h-11 items-center rounded-full bg-white/70 px-5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur dark:bg-white/10 dark:text-white" to="/books">
            View Books
          </Link>
          {!isPremium ? (
            <Link className="inline-flex min-h-11 items-center rounded-full bg-white/70 px-5 text-sm font-bold text-sky-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-sky-300" to="/pricing">
              Explore Premium
            </Link>
          ) : null}
        </div>
      </section>

      <section className="ios-card p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Your Tools</h3>
          <Link className="text-sm font-bold text-sky-600 dark:text-sky-300" to="/calculators?tab=load">View all</Link>
        </div>
        <ActionGrid items={tools} />
      </section>

      <section className="ios-card p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Featured Books</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Practical guides for sizing, wiring, configuration, and diagnosis.</p>
          </div>
          <Link className="shrink-0 text-sm font-bold text-sky-600 dark:text-sky-300" to="/books">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {featuredBooks.map((book) => (
            <Link key={book.id} to="/books" className="rounded-2xl border border-white/70 bg-white/60 p-3 transition hover:bg-sky-50/75 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
              <img src={book.cover} alt={`${book.title} cover`} className="aspect-[3/4] w-full rounded-xl object-cover shadow-sm" loading="lazy" />
              <div className="mt-3 line-clamp-2 font-heading text-sm font-bold text-slate-950 dark:text-white">{book.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="ios-card p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Quick Actions</h3>
        </div>
        <ActionGrid items={quickActions} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-950 dark:text-white">Free Tools</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Start with the essentials before moving into advanced design work.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {freeItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
              {isPremium ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-950 dark:text-white">{isPremium ? `${planName} Active` : 'Professional Tools'}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{isPremium ? 'Advanced sizing and quotation tools are available for this account.' : 'Unlock the design tools installers use for complete system proposals.'}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {premiumItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {!isPremium ? (
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-950 dark:text-white">Upgrade Professional Access</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monthly and Yearly Premium unlock the full Solar Hub professional toolkit.</p>
            </div>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/20" to="/pricing">
              Explore Premium
            </Link>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
