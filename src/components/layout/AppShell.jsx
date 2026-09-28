import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, ChevronRight, ClipboardCheck, Compass, FileText, Menu, Search, Settings, User, X } from 'lucide-react'
import { navigation } from '../../data/navigation'

const titles = {
  '/': 'Solar Hub',
  '/calculators': 'Solar Design',
  '/troubleshooting': 'Troubleshooting',
  '/codes': 'Fault Codes',
  '/quiz': 'Solar Quiz',
  '/books': 'Ebooks',
  '/quotation': 'Quotation Generator',
  '/quotation/preview': 'Quotation Preview',
  '/navigator': 'Solar Navigator',
  '/settings': 'Settings',
  '/auth': 'Account',
  '/reset-password': 'Reset Password',
  '/pricing': 'Pricing',
}

const drawerLinks = [
  { id: 'account', label: 'Account', path: '/auth', icon: User },
  { id: 'books', label: 'Books', path: '/books', icon: BookOpen },
  { id: 'quote', label: 'Quote', path: '/quotation', icon: FileText },
  { id: 'codes', label: 'Codes', path: '/codes', icon: FileText },
  { id: 'quiz', label: 'Quiz', path: '/quiz', icon: ClipboardCheck },
  { id: 'navigator', label: 'Solar Navigator', path: '/navigator', icon: Compass },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
]

export function AppShell() {
  const location = useLocation()
  const title = titles[location.pathname] || 'Solar Hub'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const mobileNav = navigation.filter((item) => ['home', 'calculators', 'troubleshooting', 'books'].includes(item.id))

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!drawerOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-sky-50/30 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <aside className="fixed inset-y-4 left-4 z-40 hidden w-64 flex-col rounded-[32px] border border-white/75 bg-white/72 text-slate-900 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/72 dark:text-white lg:flex">
        <div className="border-b border-slate-200/70 p-6 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="font-heading text-lg font-extrabold uppercase leading-tight">Solar Hub</div>
              <div className="mt-0.5 text-xs text-slate-400">Premium solar toolkit</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition ${isActive ? 'bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/10' : 'text-slate-600 hover:bg-white/80 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'}`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="p-4">
          <NavLink className="mt-5 flex min-h-11 items-center justify-between rounded-2xl px-3 text-sm font-semibold text-slate-500 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-white/10" to="/settings">
            <span className="inline-flex items-center gap-3"><Settings className="h-5 w-5" /> Settings</span>
            <ChevronRight className="h-4 w-4" />
          </NavLink>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/65 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/65 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <h1 className="shrink-0 font-heading text-lg font-extrabold text-slate-950 dark:text-white lg:hidden">{title}</h1>
            <div className="hidden min-h-11 w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/75 px-4 text-sm text-slate-400 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 lg:flex">
              <Search className="h-4 w-4 text-sky-700 dark:text-sky-300" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search tools, calculations, books..." aria-label="Search tools, calculations, books" />
            </div>
            <div className="flex items-center gap-2">
              <NavLink className="hidden min-h-10 items-center gap-3 rounded-full bg-white/75 px-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-slate-200 sm:inline-flex" to="/auth">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300"><User className="h-4 w-4" /></span>
                Account
              </NavLink>
              <button
                className="inline-flex min-h-10 w-10 items-center justify-center rounded-full bg-white/75 text-sky-700 shadow-sm backdrop-blur transition hover:bg-sky-50 dark:bg-white/10 dark:text-sky-300 dark:hover:bg-white/15 lg:hidden"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-5 pb-28 sm:px-6 sm:py-8 lg:pb-8">
          <Outlet />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-4 z-50 px-3 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <nav className="ios-pill mx-auto grid max-w-md grid-cols-5 p-1.5">
          {mobileNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-full text-[10px] font-semibold transition ${isActive ? 'bg-white/45 text-slate-700 shadow-sm ring-1 ring-white/70 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-sky-600 dark:text-sky-300' : 'text-current'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
          <button className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-full text-[10px] font-semibold text-slate-500 transition dark:text-slate-400" onClick={() => setDrawerOpen(true)} aria-label="Open menu" aria-expanded={drawerOpen}>
            <Menu className="h-5 w-5" />
            Menu
          </button>
        </nav>
      </div>

      {drawerOpen ? <button className="fixed inset-0 z-[60] bg-slate-950/20 backdrop-blur-[2px] lg:hidden" aria-label="Close menu overlay" onClick={() => setDrawerOpen(false)} /> : null}
      <aside className={`fixed bottom-0 right-0 top-0 z-[70] w-[82vw] max-w-sm border-l border-white/70 bg-white/86 p-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] shadow-2xl backdrop-blur-2xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-950/90 lg:hidden ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!drawerOpen}>
        <div className="flex items-center justify-between">
          <div className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Menu</div>
          <button className="inline-flex min-h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700 dark:bg-white/10 dark:text-sky-300" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-8 space-y-2">
          {drawerLinks.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.id} to={item.path} className="flex min-h-14 items-center justify-between rounded-2xl px-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-white/10">
                <span className="inline-flex items-center gap-3">
                  <Icon className="h-5 w-5 text-sky-800 dark:text-sky-300" />
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </div>
  )
}
