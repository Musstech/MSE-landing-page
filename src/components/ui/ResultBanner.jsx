export function ResultBanner({ label, value, unit, sub }) {
  return (
    <section className="result-banner p-5">
      <div className="text-xs font-semibold text-sky-700 dark:text-sky-300">{label}</div>
      <div className="technical-value mt-1 break-words font-heading text-3xl font-extrabold text-slate-950 dark:text-white">
        {value}
        {unit ? <span className="ml-2 text-base font-semibold text-slate-500 dark:text-slate-300">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{sub}</div> : null}
    </section>
  )
}
