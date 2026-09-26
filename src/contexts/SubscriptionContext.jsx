import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

const SubscriptionContext = createContext(null)

function isExpired(expiresAt) {
  if (!expiresAt) return false
  return new Date(expiresAt).getTime() <= Date.now()
}

function resolvePlanCode(subscription, plan) {
  return plan?.code || subscription?.plan || null
}

function resolvePlanName(planCode) {
  if (planCode === 'monthly') return 'Monthly Premium'
  if (planCode === 'yearly') return 'Yearly Premium'
  if (planCode === 'free') return 'Free'
  return 'No plan'
}

export function SubscriptionProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [plan, setPlan] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [featureAccess, setFeatureAccess] = useState({})

  const refreshSubscription = useCallback(async () => {
    if (!supabase || !user) {
      setSubscription(null)
      setPlan(null)
      setProfile(null)
      setFeatureAccess({})
      setError('')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    setFeatureAccess({})

    try {
      const [{ data: subscriptionData, error: subscriptionError }, { data: profileData, error: profileError }] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('id,user_id,plan,plan_id,status,provider,provider_reference,started_at,expires_at,created_at,updated_at')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('id,full_name,phone,role,created_at,updated_at')
          .eq('id', user.id)
          .maybeSingle(),
      ])

      if (subscriptionError) throw subscriptionError
      if (profileError) throw profileError

      setSubscription(subscriptionData ?? null)
      setProfile(profileData ?? null)

      if (subscriptionData?.plan_id) {
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('id,code,name,billing_interval,is_active,paystack_plan_code')
          .eq('id', subscriptionData.plan_id)
          .maybeSingle()

        if (planError) throw planError
        setPlan(planData ?? null)
      } else {
        setPlan(null)
      }
    } catch (error) {
  console.error('Subscription refresh error:', error)

  setSubscription(null)
  setPlan(null)
  setError(
    error?.message ||
    'Unable to load your subscription right now. Please try again shortly.'
  )
} finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    refreshSubscription()
  }, [authLoading, refreshSubscription])

  useEffect(() => {
    if (!user) return undefined

    function refreshOnFocus() {
      if (document.visibilityState === 'visible') {
        refreshSubscription()
      }
    }

    window.addEventListener('focus', refreshSubscription)
    document.addEventListener('visibilitychange', refreshOnFocus)
    return () => {
      window.removeEventListener('focus', refreshSubscription)
      document.removeEventListener('visibilitychange', refreshOnFocus)
    }
  }, [refreshSubscription, user])

  const hasFeature = useCallback(async (featureCode) => {
    if (!supabase || !user || !featureCode) return false
    if (Object.prototype.hasOwnProperty.call(featureAccess, featureCode)) {
      return featureAccess[featureCode]
    }

    const { data, error: rpcError } = await supabase.rpc('user_has_feature', {
      requested_feature_code: featureCode,
    })

    if (rpcError) {
      setError('Unable to verify feature access right now.')
      setFeatureAccess((current) => ({ ...current, [featureCode]: false }))
      return false
    }

    const allowed = Boolean(data)
    setFeatureAccess((current) => ({ ...current, [featureCode]: allowed }))
    return allowed
  }, [featureAccess, user])

  const planCode = resolvePlanCode(subscription, plan)
  const subscriptionActive = Boolean(user && subscription && subscription.status === 'active' && !isExpired(subscription.expires_at))
  const isPremium = Boolean(subscriptionActive && ['monthly', 'yearly'].includes(planCode))

  const value = useMemo(() => ({
    subscription,
    plan,
    profile,
    loading: authLoading || loading,
    error,
    refreshSubscription,
    hasFeature,
    isPremium,
    planCode: user ? planCode : null,
    planName: resolvePlanName(user ? planCode : null),
    subscriptionActive,
  }), [authLoading, error, hasFeature, isPremium, loading, plan, planCode, profile, refreshSubscription, subscription, subscriptionActive, user])

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used inside SubscriptionProvider')
  }
  return context
}
