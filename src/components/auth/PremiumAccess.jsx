import { createContext, useContext, useState } from 'react'
import { Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { usePersistentState } from '../../hooks/usePersistentState'
import { Button } from '../ui/Button'

const configuredPin = import.meta.env.VITE_ACCESS_PIN || 'MSE2026'
const PremiumAccessContext = createContext(null)

export function PremiumAccessProvider({ children }) {
  const [premiumUnlocked, setPremiumUnlocked] = usePersistentState('mse-premium-unlocked', false)
  return (
    <PremiumAccessContext.Provider value={{ premiumUnlocked, setPremiumUnlocked }}>
      {children}
    </PremiumAccessContext.Provider>
  )
}

export function usePremiumAccess() {
  const context = useContext(PremiumAccessContext)
  if (!context) {
    throw new Error('usePremiumAccess must be used inside PremiumAccessProvider')
  }
  return context
}

export function PremiumUnlockCard({ title = 'Unlock Premium Tools', compact = false }) {
  const { setPremiumUnlocked } = usePremiumAccess()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (pin.trim() === configuredPin) {
      setPremiumUnlocked(true)
      setError('')
      return
    }
    setError('Invalid PIN. Please check your access code and try again.')
  }

  return (
    <section className={`ios-card mx-auto w-full ${compact ? 'max-w-xl p-5' : 'max-w-2xl p-6 sm:p-8'}`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
        <Lock className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-2">
        <h2 className="font-heading text-2xl font-bold tracking-normal text-slate-950 dark:text-white">{title}</h2>
        <Sparkles className="h-5 w-5 text-sky-500" />
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Enter your access PIN to unlock battery and inverter sizing, cable and protection tools, editable pricing, and professional quotation documents.
      </p>
      <form className="mt-5" onSubmit={submit}>
        <label htmlFor="premium-pin" className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Access PIN</label>
        <input
          id="premium-pin"
          className="input text-center text-lg font-bold tracking-[0.35em]"
          type="password"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="••••••"
        />
        {error ? <div className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-200">{error}</div> : null}
        <Button className="mt-4 w-full" variant="sky" size="lg" type="submit">
          <ShieldCheck className="h-4 w-4" />
          Unlock Premium
        </Button>
      </form>
    </section>
  )
}

export function PremiumGate({ children, title }) {
  const { premiumUnlocked } = usePremiumAccess()
  if (premiumUnlocked) return children
  return <PremiumUnlockCard title={title} />
}
