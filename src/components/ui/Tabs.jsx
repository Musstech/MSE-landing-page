import clsx from 'clsx'

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tab-list mb-6 flex gap-1.5 overflow-x-auto pb-1" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'tab-button min-h-11 shrink-0 px-4 text-sm font-semibold transition',
            active === tab.id
              ? 'tab-button-active'
              : 'tab-button-idle',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
