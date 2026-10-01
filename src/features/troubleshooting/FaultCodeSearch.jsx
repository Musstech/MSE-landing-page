import { useMemo, useState } from 'react'
import { faultCodes } from '../../data/faultCodes'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'

const sevClass = {
  critical: 'fault-severity-critical',
  warning: 'fault-severity-warning',
  info: 'fault-severity-info',
}

export function FaultCodeSearch() {
  const brands = Object.keys(faultCodes)
  const [brand, setBrand] = useState(brands[0])
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => {
    const needle = search.toLowerCase()
    return faultCodes[brand].filter((fault) => [fault.code, fault.name, fault.cause, fault.fix].join(' ').toLowerCase().includes(needle))
  }, [brand, search])

  return (
    <div>
      <SectionHeader title="Fault Code Reference" subtitle="Search common inverter faults by brand, code, symptom, or cause." />
      <div className="fault-brand-tabs mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {brands.map((item) => (
          <button key={item} onClick={() => { setBrand(item); setSearch('') }} className={`fault-brand-tab min-h-10 shrink-0 px-4 text-sm font-semibold ${brand === item ? 'fault-brand-tab-active' : ''}`}>
            {item}
          </button>
        ))}
      </div>
      <input className="input mb-4" placeholder={`Search ${brand} fault codes...`} value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="grid gap-3">
        {filtered.map((fault) => (
          <Card key={`${brand}-${fault.code}`} className="fault-card p-0">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="fault-code-chip px-2 py-1 font-mono text-sm font-bold">{fault.code}</span>
              <span className="font-bold text-slate-950 dark:text-white">{fault.name}</span>
              <span className={`fault-severity ml-auto px-3 py-1 text-[10px] font-bold ${sevClass[fault.sev] || sevClass.info}`}>{fault.sev}</span>
            </div>
            <div className="p-4">
              <div className="text-sm text-slate-700 dark:text-slate-200"><strong>Cause:</strong> {fault.cause}</div>
              <div className="fault-fix mt-3 p-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><strong className="text-slate-950 dark:text-white">Fix:</strong> {fault.fix}</div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 ? <div className="empty-state p-8 text-center text-sm text-slate-500 dark:text-slate-400">No matching fault codes found.</div> : null}
      </div>
    </div>
  )
}
