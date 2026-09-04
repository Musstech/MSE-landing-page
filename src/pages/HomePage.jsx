import { Link } from 'react-router-dom'
import { Activity, ArrowRight, BatteryCharging, Cable, Calculator, CheckCircle2, Compass, FileText, Lock, Search, ShieldCheck, Sparkles, SunMedium } from 'lucide-react'
import { usePremiumAccess, PremiumUnlockCard } from '../components/auth/PremiumAccess'
import { Card } from '../components/ui/Card'
import { books } from '../data/books'

const freeItems = ['Load assessment', 'Panel sizing', 'Troubleshooting guide', 'Book library']
const premiumItems = ['Battery and inverter sizing', 'Cable and protection sizing', 'Editable pricing inputs', 'Professional quotation documents']

const quickActions = [
  { title: 'New Design', text: 'Start a complete solar sizing workflow from load assessment.', to: '/calculators', icon: SunMedium },
  { title: 'Load Calculator', text: 'Estimate connected load, daily energy use, and system demand.', to: '/calculators', icon: Calculator },
  { title: 'Panel Sizing', text: 'Convert daily energy demand into practical PV array capacity.', to: '/calculators', icon: Sparkles },
  { title: 'Diagnose System', text: 'Search fault codes and review practical troubleshooting checks.', to: '/troubleshooting', icon: Search },
  { title: 'Create Quote', text: 'Prepare a client-ready quotation with your own company details.', to: '/quotation', icon: FileText },
  { title: 'Solar Navigator', text: 'Estimate roof capacity, orientation quality, and panel fit.', to: '/navigator', icon: Compass },
]

const tools = [
  { title: 'Solar Sizing', text: 'Size PV array', to: '/calculators', icon: SunMedium },
  { title: 'Battery Sizing', text: 'Size battery bank', to: '/calculators', icon: BatteryCharging },
  { title: 'Inverter Sizing', text: 'Select inverter', to: '/calculators', icon: Activity },
  { title: 'Cable Sizing', text: 'Size cables', to: '/calculators', icon: Cable },
  { title: 'Breaker Sizing', text: 'Select protection', to: '/calculators', icon: ShieldCheck },
  { title: 'Load Calculator', text: 'Calculate loads', to: '/calculators', icon: Calculator },
]

export function HomePage() {
  const { premiumUnlocked } = usePremiumAccess()
  const featuredBooks = books.slice(0, 3)

  return (
    <div className="space-y-6">
      <section className="ios-card relative overflow-hidden p-6 sm:p-8">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            Installer engineering tools
          </div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-4xl">Welcome back to your workspace.</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
            Plan solar loads, size core components, diagnose field issues, and prepare documents your clients can understand.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/25" to="/calculators">
              <Calculator className="h-4 w-4" />
              Start a Calculation
            </Link>
            <Link className="inline-flex min-h-11 items-center rounded-full bg-white/70 px-5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur dark:bg-white/10 dark:text-white" to="/books">
              View Books
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Quick Actions</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} to={action.to} className="ios-card group block p-4 transition hover:border-sky-200 hover:bg-white/90 dark:hover:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <Icon className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500" />
                </div>
                <div className="mt-4 font-heading text-base font-bold text-slate-950 dark:text-white">{action.title}</div>
                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{action.text}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Your Tools</h3>
          <Link className="text-sm font-bold text-sky-600 dark:text-sky-300" to="/calculators">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.title} to={tool.to} className="rounded-3xl border border-white/75 bg-white/72 p-4 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <Icon className="h-5 w-5 text-sky-800 dark:text-sky-300" />
                <div className="mt-3 font-heading text-sm font-bold text-slate-950 dark:text-white">{tool.title}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{tool.text}</div>
              </Link>
            )
          })}
        </div>
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
              {premiumUnlocked ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-950 dark:text-white">{premiumUnlocked ? 'Professional Access Active' : 'Professional Tools'}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{premiumUnlocked ? 'Advanced sizing and quotation tools are available on this device.' : 'Unlock the design tools installers use for complete system proposals.'}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {premiumItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Sparkles className="h-4 w-4 text-sky-500" />
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Featured Books</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Practical guides for sizing, wiring, configuration, and fault diagnosis.</p>
          </div>
          <Link className="shrink-0 text-sm font-bold text-sky-600 dark:text-sky-300" to="/books">View all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {featuredBooks.map((book) => (
            <Link key={book.id} to="/books" className="flex items-center gap-3 rounded-2xl bg-white/65 p-3 transition hover:bg-sky-50 dark:bg-white/5 dark:hover:bg-white/10">
              <img src={book.cover} alt={`${book.title} cover`} className="h-20 w-14 shrink-0 rounded-xl object-cover" loading="lazy" />
              <div className="min-w-0">
                <div className="truncate font-heading text-sm font-bold text-slate-950 dark:text-white">{book.title}</div>
                <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{book.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {!premiumUnlocked ? <PremiumUnlockCard compact /> : null}
    </div>
  )
}
