import { useMemo, useState } from 'react'
import { faultCodes } from '../../data/faultCodes'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'

const sevClass = {
  critical: 'bg-[#C53030]',
  warning: 'bg-solar',
  info: 'bg-[#2C5282]',
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
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {brands.map((item) => (
          <button key={item} onClick={() => { setBrand(item); setSearch('') }} className={`min-h-10 shrink-0 rounded-lg px-4 text-sm font-bold ${brand === item ? 'bg-navy text-white' : 'bg-[#EEF2F7] text-navy'}`}>
            {item}
          </button>
        ))}
      </div>
      <input className="input mb-4" placeholder={`Search ${brand} fault codes...`} value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="grid gap-3">
        {filtered.map((fault) => (
          <Card key={`${brand}-${fault.code}`} className="p-0">
            <div className={`flex flex-wrap items-center gap-3 rounded-t-lg px-4 py-3 text-white ${sevClass[fault.sev] || sevClass.info}`}>
              <span className="rounded-md bg-white/20 px-2 py-1 font-mono text-sm font-bold">{fault.code}</span>
              <span className="font-bold">{fault.name}</span>
              <span className="ml-auto rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase">{fault.sev}</span>
            </div>
            <div className="p-4">
              <div className="text-sm text-navy"><strong>Cause:</strong> {fault.cause}</div>
              <div className="mt-3 rounded-lg bg-[#EEF2F7] p-3 text-sm leading-6 text-slate-600"><strong className="text-navy">Fix:</strong> {fault.fix}</div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 ? <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">No matching fault codes found.</div> : null}
      </div>
    </div>
  )
}

