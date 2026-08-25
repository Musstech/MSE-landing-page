export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-navy dark:text-white">{title}</h2>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
