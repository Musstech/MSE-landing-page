export function ResultBanner({ label, value, unit, sub }) {
  return (
    <section className="rounded-lg bg-gradient-to-br from-navy to-[#2C5282] p-5 text-white">
      <div className="text-xs font-bold uppercase tracking-wide text-white/70">{label}</div>
      <div className="mt-1 break-words font-heading text-3xl font-extrabold text-gold">
        {value}
        {unit ? <span className="ml-2 text-base font-bold text-white/80">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-1 text-xs leading-5 text-white/65">{sub}</div> : null}
    </section>
  )
}

