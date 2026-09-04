import { CheckCircle2, Moon, Sun } from 'lucide-react'
import { usePremiumAccess } from '../components/auth/PremiumAccess'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

export function SettingsPage() {
  const { premiumUnlocked } = usePremiumAccess()
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <SectionHeader title="Settings" subtitle="Manage the workspace display and access status on this device." />
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
          <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Access</h3>
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-sky-600" />
            {premiumUnlocked ? 'Professional access is active on this device.' : 'Free access is active. Professional tools require a PIN.'}
          </div>
        </Card>
      </div>
    </div>
  )
}
