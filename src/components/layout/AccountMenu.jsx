import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Moon, Settings, Sun, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useSubscription } from '../../contexts/SubscriptionContext'
import { useTheme } from '../../contexts/ThemeContext'

function initials(value) {
  return value.split(/\s|@/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'A'
}

export function AccountMenu() {
  const { user, signOut } = useAuth()
  const { profile } = useSubscription()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Account'

  useEffect(() => {
    if (!open) return undefined
    const closeMenu = (event) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.type === 'pointerdown' && !menuRef.current?.contains(event.target)) setOpen(false)
    }
    window.addEventListener('keydown', closeMenu)
    window.addEventListener('pointerdown', closeMenu)
    return () => {
      window.removeEventListener('keydown', closeMenu)
      window.removeEventListener('pointerdown', closeMenu)
    }
  }, [open])

  async function handleSignOut() {
    setError('')
    const { error: signOutError } = await signOut()
    if (signOutError) {
      setError(signOutError.message || 'Unable to sign out right now.')
      return
    }
    setOpen(false)
    navigate('/')
  }

  if (!user) {
    return (
      <Link className="header-account" to="/auth" aria-label="Sign in to your account">
        <span className="header-avatar"><User className="h-4 w-4" /></span>
        <span className="hidden text-sm font-bold sm:inline">Sign in</span>
      </Link>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button className="header-account" onClick={() => setOpen((current) => !current)} aria-label="Open account menu" aria-expanded={open}>
        <span className="header-avatar relative text-[11px] font-extrabold">{initials(displayName)}<span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" /></span>
        <span className="hidden max-w-28 truncate text-sm font-bold sm:inline">{displayName}</span>
      </button>
      {open ? (
        <div className="account-popover" role="dialog" aria-label="Account menu">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-white/10">
            <div className="font-heading text-sm font-extrabold text-slate-950 dark:text-white">{displayName}</div>
            <div className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
          </div>
          <div className="p-2">
            <Link className="account-menu-item" to="/settings" onClick={() => setOpen(false)}><Settings className="h-4 w-4" /> Settings</Link>
            <button className="account-menu-item" onClick={toggleTheme}>{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{theme === 'dark' ? 'Use light appearance' : 'Use dark appearance'}</button>
            <button className="account-menu-item text-rose-600 dark:text-rose-300" onClick={handleSignOut}><LogOut className="h-4 w-4" /> Sign out</button>
          </div>
          {error ? <p className="px-4 pb-3 text-xs leading-5 text-rose-600 dark:text-rose-300">{error}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
