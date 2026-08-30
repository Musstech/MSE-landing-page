import clsx from 'clsx'

export function Card({ children, className }) {
  return <div className={clsx('ios-card p-4 sm:p-5', className)}>{children}</div>
}

export function StatCard({ label, value, unit, tone = 'navy' }) {
  const tones = {
    navy: 'text-navy',
    gold: 'text-gold',
    orange: 'text-solar',
    green: 'text-sgreen',
    red: 'text-[#C53030]',
    blue: 'text-[#2C5282]',
  }

  return (
    <Card className="min-w-0 bg-white/70 dark:bg-slate-800/70">
      <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{label}</div>
      <div className={`mt-1 break-words font-heading text-xl font-extrabold ${tones[tone] || tones.navy}`}>
        {value}
        {unit ? <span className="ml-1 text-xs font-semibold text-slate-500">{unit}</span> : null}
      </div>
    </Card>
  )
}
