import { Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { usePersistentState } from '../../hooks/usePersistentState'
import { Button } from '../ui/Button'

const configuredPin = import.meta.env.VITE_ACCESS_PIN || 'MSE2026'

export function AccessGate({ children }) {
  const [unlocked, setUnlocked] = usePersistentState('mse-access-unlocked', false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  if (unlocked) return children

  function submit(event) {
    event.preventDefault()
    if (pin.trim() === configuredPin) {
      setUnlocked(true)
      setError('')
      return
    }
    setError('Invalid access PIN. Please check the code and try again.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 py-10 text-slate-700 dark:bg-slate-950 dark:text-slate-100">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy dark:text-white">Musstech Solar Hub</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Enter your access PIN to open the solar calculators, troubleshooting tools, and quotation generator.
        </p>
        <form className="mt-6" onSubmit={submit}>
          <label htmlFor="access-pin" className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy dark:text-slate-200">Access PIN</label>
          <input
            id="access-pin"
            className="input text-center text-lg font-bold tracking-[0.35em]"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="••••••"
            autoFocus
          />
          {error ? <div className="mt-3 rounded-lg bg-[#FFF5F5] p-3 text-sm text-[#C53030] dark:bg-red-950/30 dark:text-red-200">{error}</div> : null}
          <Button className="mt-5 w-full" variant="gold" size="lg" type="submit">
            <ShieldCheck className="h-4 w-4" />
            Unlock App
          </Button>
        </form>
        <p className="mt-5 text-xs leading-5 text-slate-400">
          For real paid access, connect this screen to a backend/payment system so each buyer gets a unique verified PIN.
        </p>
      </section>
    </main>
  )
}
