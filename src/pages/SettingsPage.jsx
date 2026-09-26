import { Link } from 'react-router-dom'
import { CheckCircle2, Moon, Sun } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

function formatDate(value) {
  if (!value) return 'Not set'
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))
}

export function SettingsPage() {
  const { user } = useAuth()
  const { profile, subscription, planName, planCode, subscriptionActive, loading } = useSubscription()
  const { theme, toggleTheme } = useTheme()
  const displayName = profile?.full_name || user?.email || 'Guest'
  const isFree = planCode === 'free' || !subscriptionActive

  return (
    <div>
      <SectionHeader title="Settings" subtitle="Manage the workspace display, account details, and subscription status." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Appearance</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Switch between light and dark mode for field work or office review.</p>
          <Button className="mt-5" variant="soft" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Use Light Mode' : 'Use Dark Mode'}
          </Button>
        </Card>

        <Card>
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Account</h3>
          <div className="mt-4 rounded-2xl bg-sky-50/70 p-4 dark:bg-sky-400/10">
            <div className="text-sm font-bold text-slate-950 dark:text-white">{displayName}</div>
            <div className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">{user?.email || 'Not signed in'}</div>
            {profile?.phone ? <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{profile.phone}</div> : null}
            {profile?.role ? <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Role: {profile.role}</div> : null}
          </div>
          {!user ? <Button as={Link} to="/auth" className="mt-5" variant="primary">Sign In</Button> : null}
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Subscription</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-white/5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current Plan</div>
              <div className="mt-1 font-heading text-xl font-extrabold text-slate-950 dark:text-white">{loading ? 'Loading...' : planName}</div>
            </div>
            <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-white/5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</div>
              <div className="mt-1 flex items-center gap-2 font-heading text-xl font-extrabold text-slate-950 dark:text-white">
                <CheckCircle2 className="h-5 w-5 text-sky-600" />
                {subscription?.status || (user ? 'No subscription' : 'Signed out')}
              </div>
            </div>
            <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-white/5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Expiry</div>
              <div className="mt-1 font-heading text-xl font-extrabold text-slate-950 dark:text-white">{formatDate(subscription?.expires_at)}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {isFree ? "You're currently using the Free plan." : `${planName} is active for this account.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {isFree ? <Button as={Link} to="/pricing" variant="primary">Upgrade to Professional</Button> : null}
            <Button as={Link} to="/pricing" variant="soft">{isFree ? 'View Plans' : 'Manage Plan'}</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
