import { Link } from 'react-router-dom'
import { CheckCircle2, Lock, Sparkles, Zap } from 'lucide-react'
import { usePremiumAccess, PremiumUnlockCard } from '../components/auth/PremiumAccess'
import { Card } from '../components/ui/Card'

const freeItems = ['Homepage', 'Ebook store', 'Troubleshooting', 'Basic load calculator']
const premiumItems = ['Full solar sizing', 'Cable and breaker sizing', 'Cost editing', 'Professional quotations']

export function HomePage() {
  const { premiumUnlocked } = usePremiumAccess()

  return (
    <div className="space-y-6">
      <section className="ios-card relative overflow-hidden p-6 sm:p-8">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            Premium solar toolkit
          </div>
          <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-5xl">Solar Hub</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
            A clean mobile workspace for solar sizing, diagnosis, learning resources, and installer-ready quotations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/25" to="/calculators">
              <Zap className="h-4 w-4" />
              Start Free
            </Link>
            <Link className="inline-flex min-h-11 items-center rounded-full bg-white/70 px-5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur dark:bg-white/10 dark:text-white" to="/books">
              View Books
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-950 dark:text-white">Free Access</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Open tools for first-time users.</p>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-sky-500">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-950 dark:text-white">Premium Tools</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{premiumUnlocked ? 'Premium is unlocked on this device.' : 'Unlock with your access PIN.'}</p>
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

      {!premiumUnlocked ? <PremiumUnlockCard compact /> : null}
    </div>
  )
}
