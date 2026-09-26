import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useSubscription } from '../../contexts/SubscriptionContext'
import { Button } from '../ui/Button'

export function PremiumGate({ children, featureCode, title = 'Professional Access Required' }) {
  const { user, loading: authLoading } = useAuth()
  const { loading: subscriptionLoading, hasFeature } = useSubscription()
  const [allowed, setAllowed] = useState(false)
  const [checking, setChecking] = useState(Boolean(user && featureCode))
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function checkAccess() {
      if (!user || !featureCode) {
        setAllowed(false)
        setChecking(false)
        return
      }

      setChecking(true)
      setError('')
      try {
        const nextAllowed = await hasFeature(featureCode)
        if (active) setAllowed(nextAllowed)
      } catch {
        if (active) {
          setAllowed(false)
          setError('Unable to verify access right now. Please try again.')
        }
      } finally {
        if (active) setChecking(false)
      }
    }

    checkAccess()
    return () => {
      active = false
    }
  }, [featureCode, hasFeature, user])

  if (authLoading || subscriptionLoading || checking) {
    return (
      <section className="ios-card mx-auto max-w-2xl p-6 text-center">
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-300">Checking your access...</div>
      </section>
    )
  }

  if (allowed) return children

  if (!user) {
    return (
      <AccessCard
        title="Sign in to continue"
        message="Create an account or sign in to check your Solar Hub feature access."
        action={<Button as={Link} to="/auth" variant="primary">Sign In</Button>}
      />
    )
  }

  return (
    <AccessCard
      title={title}
      message={error || 'This professional tool is available on Monthly or Yearly Premium.'}
      action={<Button as={Link} to="/pricing" variant="primary">Upgrade to Professional</Button>}
    />
  )
}

function AccessCard({ title, message, action }) {
  return (
    <section className="ios-card mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
        <Lock className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-2">
        <h2 className="font-heading text-2xl font-bold tracking-normal text-slate-950 dark:text-white">{title}</h2>
        <ShieldCheck className="h-5 w-5 text-sky-500" />
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
      <div className="mt-5">{action}</div>
    </section>
  )
}
