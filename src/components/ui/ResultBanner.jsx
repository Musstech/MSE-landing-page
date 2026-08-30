export function ResultBanner({ label, value, unit, sub }) {
  return (
    <section className="rounded-[28px] border border-sky-200/70 bg-gradient-to-br from-sky-500 to-blue-600 p-5 text-white shadow-[0_18px_45px_rgba(14,165,233,0.25)]">
      <div className="text-xs font-bold uppercase tracking-wide text-white/75">{label}</div>
      <div className="mt-1 break-words font-heading text-3xl font-extrabold text-white">
        {value}
        {unit ? <span className="ml-2 text-base font-bold text-white/80">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-1 text-xs leading-5 text-white/65">{sub}</div> : null}
    </section>
  )
}
