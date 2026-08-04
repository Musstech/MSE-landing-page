import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { navigation } from '../../data/navigation'

const titles = {
  '/': 'Musstech Solar Hub',
  '/calculators': 'Solar Calculators',
  '/troubleshooting': 'Troubleshooting',
  '/books': 'MSE Ebook Store',
  '/quotation': 'Quotation Generator',
}

export function AppShell() {
  const location = useLocation()
  const title = titles[location.pathname] || 'Musstech Solar Hub'

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-700">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-navy text-white lg:flex">
        <div className="border-b border-white/10 p-6">
          <div className="font-heading text-lg font-extrabold leading-tight text-gold">Musstech</div>
          <div className="font-heading text-lg font-extrabold leading-tight">Solar Hub</div>
          <div className="mt-1 text-xs text-white/45">Plan Smart. Power Better.</div>
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
                  `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${isActive ? 'bg-gold/15 text-gold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="border-t border-white/10 p-5 text-xs text-white/40">2026 Musstech Solar Energy</div>
      </aside>

      <main className="min-h-screen lg:pl-60">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <h1 className="font-heading text-lg font-extrabold text-navy">{title}</h1>
          <a className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-gold px-3 text-sm font-bold text-navy" href="https://selar.com/89d88rao55" target="_blank" rel="noreferrer">
            <BookOpen className="h-4 w-4" />
            Books
          </a>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-5 pb-24 sm:px-6 sm:py-8 lg:pb-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide ${isActive ? 'bg-[#EEF2F7] text-navy' : 'text-slate-400'}`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

