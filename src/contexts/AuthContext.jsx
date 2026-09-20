import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const passwordRecoveryRedirectTo = 'http://localhost:5173/reset-password'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const user = session?.user ?? null

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return undefined
    }

    let mounted = true

    async function initializeSession() {
      const url = new URL(window.location.href)
      const recoveryCode = url.pathname === '/reset-password' ? url.searchParams.get('code') : null

      if (recoveryCode) {
        const { data } = await supabase.auth.exchangeCodeForSession(recoveryCode)
        if (data.session && mounted) {
          setSession(data.session)
        }
        window.history.replaceState({}, document.title, url.pathname)
      }

      const { data, error } = await supabase.auth.getSession()
      if (!mounted) return
      if (!error) setSession(data.session)
      setLoading(false)
    }

    initializeSession().catch(() => {
      if (mounted) setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isSupabaseConfigured,
    signUp: async ({ email, password }) => {
      if (!supabase) throw new Error('Supabase is not configured.')
      return supabase.auth.signUp({ email, password })
    },
    signIn: async ({ email, password }) => {
      if (!supabase) throw new Error('Supabase is not configured.')
      return supabase.auth.signInWithPassword({ email, password })
    },
    signOut: async () => {
      if (!supabase) throw new Error('Supabase is not configured.')
      return supabase.auth.signOut()
    },
    resetPassword: async ({ email }) => {
      if (!supabase) throw new Error('Supabase is not configured.')
      return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: passwordRecoveryRedirectTo,
      })
    },
    updatePassword: async ({ password }) => {
      if (!supabase) throw new Error('Supabase is not configured.')
      return supabase.auth.updateUser({ password })
    },
  }), [loading, session, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
