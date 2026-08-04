import clsx from 'clsx'

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'min-h-10 shrink-0 rounded-lg px-4 text-sm font-bold transition',
            active === tab.id ? 'bg-navy text-white' : 'bg-[#EEF2F7] text-navy hover:bg-slate-200',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

