import { Plus, Trash2 } from 'lucide-react'
import { usePersistentState } from '../../hooks/usePersistentState'
import { calculateInverter } from '../../utils/solarFormulas'
import { formatNumber } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Callout } from '../../components/ui/Callout'
import { Card, StatCard } from '../../components/ui/Card'
import { ResultBanner } from '../../components/ui/ResultBanner'
import { SectionHeader } from '../../components/ui/SectionHeader'

const initialLoads = [
  { id: 1, name: 'LED Lights & Fans', watts: 300, qty: 1, surge: 'default' },
  { id: 2, name: 'Refrigerator', watts: 200, qty: 1, surge: 'fridge' },
  { id: 3, name: 'LED TV', watts: 120, qty: 1, surge: 'default' },
  { id: 4, name: 'AC 1.5HP', watts: 1100, qty: 1, surge: 'ac' },
]

export function InverterCalculator() {
  const [loads, setLoads] = usePersistentState('mse-inverter-loads', initialLoads)
  const result = calculateInverter(loads)
  const update = (id, field, value) => setLoads((current) => current.map((load) => (load.id === id ? { ...load, [field]: value } : load)))

  return (
    <div>
      <SectionHeader title="Inverter Sizing Calculator" subtitle="Includes peak continuous load and the largest motor starting surge." action={<Button variant="soft" size="sm" onClick={() => setLoads((current) => [...current, { id: Date.now(), name: 'New Load', watts: 100, qty: 1, surge: 'default' }])}><Plus className="h-4 w-4" />Load</Button>} />
      <Card className="mb-4 p-0">
        <div className="hidden grid-cols-[1fr_90px_70px_130px_44px] gap-2 rounded-t-lg bg-navy px-4 py-3 text-xs font-bold uppercase tracking-wide text-white md:grid">
          <div>Load</div><div>Watts</div><div>Qty</div><div>Surge</div><div />
        </div>
        {loads.map((load) => (
          <div key={load.id} className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_90px_70px_130px_44px] md:items-center">
            <input className="input" value={load.name} onChange={(event) => update(load.id, 'name', event.target.value)} />
            <input className="input" type="number" min="0" value={load.watts} onChange={(event) => update(load.id, 'watts', Number(event.target.value))} />
            <input className="input" type="number" min="0" value={load.qty} onChange={(event) => update(load.id, 'qty', Number(event.target.value))} />
            <select className="input bg-white" value={load.surge} onChange={(event) => update(load.id, 'surge', event.target.value)}>
              <option value="default">General</option><option value="fan">Fan</option><option value="fridge">Fridge</option><option value="freezer">Freezer</option><option value="ac">AC</option><option value="pump">Pump</option>
            </select>
            <Button variant="danger" size="sm" onClick={() => setLoads((current) => current.filter((item) => item.id !== load.id))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </Card>
      <ResultBanner label="Inverter Required" value={`${formatNumber(result.recommended / 1000, 1)} kVA`} sub={`Minimum: ${formatNumber(result.required / 1000, 1)} kVA | Continuous: ${formatNumber(result.continuous)}W | Surge: ${formatNumber(result.maxSurge)}W`} />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatCard label="Continuous" value={formatNumber(result.continuous)} unit="W" tone="gold" />
        <StatCard label="Motor Surge" value={formatNumber(result.maxSurge)} unit="W" tone="orange" />
        <StatCard label="With Margin" value={formatNumber(result.required)} unit="W" />
      </div>
      <Callout>Verify the inverter surge rating in the manufacturer datasheet, not only its continuous kVA rating.</Callout>
    </div>
  )
}

