import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ChevronRight, ClipboardCheck, Compass, FileText, Mail, Menu, MessageCircle, Moon, Search, Settings, Sun, X } from 'lucide-react'
import { navigation } from '../../data/navigation'
import { useTheme } from '../../contexts/ThemeContext'
import { AccountMenu } from './AccountMenu'
import { GlobalSearch } from './GlobalSearch'

const drawerLinks = [
  { id: 'diagnose', label: 'Diagnose', path: '/troubleshooting', icon: Search },
  { id: 'quote', label: 'Quotation', path: '/quotation', icon: FileText },
  { id: 'navigator', label: 'Solar Navigator', path: '/navigator', icon: Compass },
  { id: 'codes', label: 'Fault Codes', path: '/codes', icon: ClipboardCheck },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
]

export function AppShell() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const primaryNavigation = useMemo(() => navigation.filter((item) => ['home', 'calculators', 'quiz', 'books'].includes(item.id)), [])

  useEffect(() => {
    setDrawerOpen(false)
    setSearchOpen(false)
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
    <div className="min-h-screen bg-[#f7fbff] text-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <header className="sticky top-0 z-40 border-b border-sky-100/70 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80">
        <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center gap-3 px-4 sm:px-6">
          <NavLink to="/" className="brand-lockup shrink-0" aria-label="Solar Hub home">
            <span className="brand-mark"><Compass className="h-5 w-5" /></span>
            <span className="font-heading text-base font-extrabold text-slate-950 dark:text-white">Solar Hub</span>
          </NavLink>

          <nav className="ml-3 hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {primaryNavigation.map((item) => {
              const Icon = item.icon
              return <NavLink key={item.id} to={item.path} end={item.path === '/'} className={({ isActive }) => `desktop-nav-link ${isActive ? 'desktop-nav-link-active' : ''}`}><Icon className="h-[18px] w-[18px]" />{item.label}</NavLink>
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button className="header-search" onClick={() => setSearchOpen(true)} aria-label="Search the Solar Hub workspace">
              <Search className="h-4 w-4 text-sky-600 dark:text-sky-300" />
              <span className="hidden sm:inline">Search workspace</span>
            </button>
            <button className="icon-button hidden sm:inline-flex" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Use light appearance' : 'Use dark appearance'}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <AccountMenu />
            <button className="icon-button" onClick={() => setDrawerOpen((current) => !current)} aria-label={drawerOpen ? 'Close menu' : 'Open menu'} aria-expanded={drawerOpen}>
              {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-7 pb-28 sm:px-6 sm:py-10 lg:pb-12">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer border-t border-slate-200/70 px-4 pb-28 pt-6 dark:border-white/10 lg:pb-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="footer-brand">Solar Hub <span>MUSSTECH SOLAR ENERGY</span></span>
          <div className="footer-contacts" aria-label="Contact Solar Hub">
            <a className="footer-contact" href="mailto:imammusa2017@gmail.com"><span className="footer-contact-icon"><Mail className="h-4 w-4" /></span><span>imammusa2017@gmail.com</span></a>
            <a className="footer-contact" href="https://wa.me/2349151834345" target="_blank" rel="noreferrer"><span className="footer-contact-icon"><MessageCircle className="h-4 w-4" /></span><span>WhatsApp</span></a>
          </div>
          <span>© 2026 Solar Hub</span>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-4 z-50 px-3 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <nav className="ios-pill mx-auto grid max-w-md grid-cols-5 p-1.5" aria-label="Mobile navigation">
          {primaryNavigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.id} to={item.path} end={item.path === '/'} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
          <button className="mobile-nav-link" onClick={() => setDrawerOpen(true)} aria-label="Open more pages" aria-expanded={drawerOpen}>
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {drawerOpen ? <button className="fixed inset-0 z-[60] bg-slate-950/20 backdrop-blur-[2px]" aria-label="Close menu overlay" onClick={() => setDrawerOpen(false)} /> : null}
      <aside className={`workspace-drawer ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!drawerOpen}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
          <div>
            <div className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Workspace</div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">More Solar Hub tools</div>
          </div>
          <button className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="mt-5 space-y-1" aria-label="More workspace pages">
          {drawerLinks.map((item) => {
            const Icon = item.icon
            return <NavLink key={item.id} to={item.path} className={({ isActive }) => `drawer-link ${isActive ? 'drawer-link-active' : ''}`}>
              <span className="inline-flex items-center gap-3"><Icon className="h-5 w-5" />{item.label}</span>
              <ChevronRight className="h-4 w-4" />
            </NavLink>
          })}
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">A focused workspace for solar design, field checks, and client documents.</div>
      </aside>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
