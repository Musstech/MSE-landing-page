export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-header mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="font-heading text-2xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-[1.75rem]">{title}</h2>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
