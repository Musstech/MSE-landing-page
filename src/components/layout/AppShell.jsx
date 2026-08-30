import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, Moon, Sun } from 'lucide-react'
import { navigation } from '../../data/navigation'
import { useTheme } from '../../contexts/ThemeContext'

const titles = {
  '/': 'Solar Hub',
  '/calculators': 'Solar Calculators',
  '/troubleshooting': 'Troubleshooting',
  '/books': 'Ebooks',
  '/quotation': 'Quotation Generator',
}

export function AppShell() {
  const location = useLocation()
  const title = titles[location.pathname] || 'Solar Hub'
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen text-slate-700 dark:text-slate-200">
      <aside className="fixed inset-y-4 left-4 z-40 hidden w-64 flex-col rounded-[32px] border border-white/70 bg-white/65 text-slate-900 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 dark:text-white lg:flex">
        <div className="border-b border-slate-200/70 p-6 dark:border-white/10">
          <div className="font-heading text-xl font-extrabold leading-tight">Solar Hub</div>
          <div className="mt-1 text-xs text-slate-400">Premium solar workflow</div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition ${isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'text-slate-500 hover:bg-white/70 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'}`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="border-t border-slate-200/70 p-5 text-xs text-slate-400 dark:border-white/10">2026 Solar Hub</div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-white/60 bg-white/60 px-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 sm:px-6">
          <h1 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">{title}</h1>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex min-h-10 w-10 items-center justify-center rounded-full bg-white/75 text-sky-600 shadow-sm backdrop-blur transition hover:bg-sky-50 dark:bg-white/10 dark:text-sky-300 dark:hover:bg-white/15"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a className="inline-flex min-h-10 items-center gap-2 rounded-full bg-sky-500 px-4 text-sm font-bold text-white shadow-lg shadow-sky-500/25" href="https://selar.com/m/M_S_E" target="_blank" rel="noreferrer">
              <BookOpen className="h-4 w-4" />
              Books
            </a>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-5 pb-28 sm:px-6 sm:py-8 lg:pb-8">
          <Outlet />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-4 z-50 px-3 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <nav className="ios-pill mx-auto grid max-w-md grid-cols-5 p-1.5">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-full text-[10px] font-semibold transition ${isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'text-slate-500 dark:text-slate-400'}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
