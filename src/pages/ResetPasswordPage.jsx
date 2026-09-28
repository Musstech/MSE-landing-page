import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, KeyRound } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { TextInput } from '../components/ui/Form'
import { SectionHeader } from '../components/ui/SectionHeader'

export function ResetPasswordPage() {
  const { loading, isSupabaseConfigured, updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    setError('')

    try {
      if (!password || !confirmPassword) {
        throw new Error('Enter and confirm your new password.')
      }
      if (password !== confirmPassword) {
        throw new Error('The two passwords do not match.')
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.')
      }

      const { error: authError } = await updatePassword({ password })
      if (authError) throw authError

      setPassword('')
      setConfirmPassword('')
      setMessage('Password updated successfully. You can now sign in with your new password.')
    } catch (authError) {
      setError(authError.message || 'Password update failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <SectionHeader title="Reset Password" subtitle="Choose a new password from the secure link sent to your email." />
      <Card className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Choose a New Password</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Use the same browser session opened from the recovery email.</p>
          </div>
        </div>

        {!isSupabaseConfigured ? (
          <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            Account service is not available right now. Please try again shortly.
          </div>
        ) : null}

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <TextInput label="New Password" type="password" value={password} onChange={setPassword} />
          <TextInput label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
          <Button type="submit" variant="primary" size="lg" disabled={!isSupabaseConfigured || loading || submitting}>
            <CheckCircle2 className="h-4 w-4" />
            Update Password
          </Button>
        </form>

        {message ? (
          <div className="mt-4 rounded-2xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-100">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-100">
            {error}
          </div>
        ) : null}

        <Button as={Link} to="/auth" className="mt-5 w-full" variant="soft">
          Back to Account
        </Button>
      </Card>
    </div>
  )
}
