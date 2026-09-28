import clsx from 'clsx'

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'min-h-10 shrink-0 rounded-xl border px-4 text-sm font-bold transition',
            active === tab.id
              ? 'border-sky-200 bg-sky-100/70 text-sky-800 shadow-sm dark:border-sky-400/25 dark:bg-sky-400/15 dark:text-sky-200'
              : 'border-white/70 bg-white/60 text-slate-600 hover:border-sky-100 hover:bg-sky-50/80 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
