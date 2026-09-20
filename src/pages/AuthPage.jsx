import { useState } from 'react'
import { KeyRound, LogIn, LogOut, Mail, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { TextInput } from '../components/ui/Form'
import { SectionHeader } from '../components/ui/SectionHeader'

export function AuthPage() {
  const { user, session, loading, isSupabaseConfigured, signUp, signIn, signOut, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function runAuth(action) {
    setSubmitting(true)
    setMessage('')
    setError('')
    try {
      const { error: authError } = await action({ email, password })
      if (authError) throw authError
      setMessage('Authentication request completed successfully.')
    } catch (authError) {
      setError(authError.message || 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignOut() {
    setSubmitting(true)
    setMessage('')
    setError('')
    try {
      const { error: authError } = await signOut()
      if (authError) throw authError
      setMessage('Signed out successfully.')
    } catch (authError) {
      setError(authError.message || 'Sign out failed.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePasswordReset() {
    setSubmitting(true)
    setMessage('')
    setError('')
    try {
      if (!email.trim()) {
        throw new Error('Enter your email address first, then request a password reset.')
      }
      const { error: authError } = await resetPassword({ email: email.trim() })
      if (authError) throw authError
      setMessage('Password reset email sent. Open the link in your email to set a new password.')
    } catch (authError) {
      setError(authError.message || 'Password reset failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <SectionHeader title="Account" subtitle="Temporary Supabase authentication screen for testing email and password access." />
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Email Authentication</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">This is only for verifying Supabase auth wiring.</p>
            </div>
          </div>

          {!isSupabaseConfigured ? (
            <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
              Supabase is not configured yet. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your local environment file, then restart the dev server.
            </div>
          ) : null}

          <form className="mt-5 grid gap-4" onSubmit={(event) => event.preventDefault()}>
            <TextInput label="Email" type="email" value={email} onChange={setEmail} />
            <TextInput label="Password" type="password" value={password} onChange={setPassword} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="button" variant="primary" disabled={!isSupabaseConfigured || submitting || loading} onClick={() => runAuth(signUp)}>
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
              <Button type="button" variant="soft" disabled={!isSupabaseConfigured || submitting || loading} onClick={() => runAuth(signIn)}>
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>
            <Button type="button" variant="ghost" className="justify-self-start px-0" disabled={!isSupabaseConfigured || submitting || loading} onClick={handlePasswordReset}>
              <KeyRound className="h-4 w-4" />
              Forgot password?
            </Button>
          </form>

          {message ? <div className="mt-4 rounded-2xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-100">{message}</div> : null}
          {error ? <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-100">{error}</div> : null}
        </Card>

        <Card>
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Current Session</h3>
          <div className="mt-4 rounded-2xl bg-sky-50/70 p-4 text-sm leading-6 text-slate-600 dark:bg-sky-400/10 dark:text-slate-300">
            {loading ? 'Checking Supabase session...' : user ? (
              <>
                <div className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">Signed in as</div>
                <div className="mt-1 break-all font-semibold text-slate-950 dark:text-white">{user.email}</div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">User ID: {user.id}</div>
              </>
            ) : 'No authenticated Supabase user is active.'}
          </div>
          {session ? (
            <Button className="mt-5 w-full" type="button" variant="danger" disabled={submitting} onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
