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

function mapLoadRows(rows) {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    watts: row.watts,
    qty: row.qty,
    surge: row.surge || 'default',
  }))
}

export function InverterCalculator({ sourceLoads }) {
  const [storedLoads, setStoredLoads] = usePersistentState('mse-inverter-loads', initialLoads)
  const controlled = Array.isArray(sourceLoads)
  const loads = controlled ? mapLoadRows(sourceLoads) : storedLoads
  const setLoads = controlled ? () => {} : setStoredLoads
  const result = calculateInverter(loads)
  const update = (id, field, value) => setLoads((current) => current.map((load) => (load.id === id ? { ...load, [field]: value } : load)))

  return (
    <div>
      <SectionHeader
        title="Inverter Sizing Calculator"
        subtitle="Uses the connected appliance list to calculate peak continuous load and the largest motor starting surge."
        action={!controlled ? <Button variant="soft" size="sm" onClick={() => setLoads((current) => [...current, { id: Date.now(), name: 'New Load', watts: 100, qty: 1, surge: 'default' }])}><Plus className="h-4 w-4" />Load</Button> : null}
      />
      <Card className="mb-4 p-0">
        {controlled ? <div className="border-b border-sky-100 bg-sky-50/70 px-4 py-3 text-xs font-semibold text-sky-800 dark:border-white/10 dark:bg-sky-400/10 dark:text-sky-200">Synced from Load Calculator. Edit wattage, quantity, and surge type from the load schedule.</div> : null}
        <div className={`hidden gap-2 rounded-t-lg bg-navy px-4 py-3 text-xs font-bold uppercase tracking-wide text-white md:grid ${controlled ? 'md:grid-cols-[1fr_90px_70px_130px]' : 'md:grid-cols-[1fr_90px_70px_130px_44px]'}`}>
          <div>Load</div><div>Watts</div><div>Qty</div><div>Surge</div>{!controlled ? <div /> : null}
        </div>
        {loads.map((load) => (
          <div key={load.id} className={`grid gap-3 border-b border-slate-100 p-4 md:items-center ${controlled ? 'md:grid-cols-[1fr_90px_70px_130px]' : 'md:grid-cols-[1fr_90px_70px_130px_44px]'}`}>
            <label className="block">
              <span className="mobile-row-label">Load</span>
              <input className="input" value={load.name} onChange={(event) => update(load.id, 'name', event.target.value)} readOnly={controlled} />
            </label>
            <label className="block">
              <span className="mobile-row-label">Watts</span>
              <input className="input" type="number" min="0" value={load.watts} onChange={(event) => update(load.id, 'watts', Number(event.target.value))} readOnly={controlled} />
            </label>
            <label className="block">
              <span className="mobile-row-label">Qty</span>
              <input className="input" type="number" min="0" value={load.qty} onChange={(event) => update(load.id, 'qty', Number(event.target.value))} readOnly={controlled} />
            </label>
            <label className="block">
              <span className="mobile-row-label">Surge Type</span>
              <select className="input bg-white" value={load.surge} onChange={(event) => update(load.id, 'surge', event.target.value)} disabled={controlled}>
                <option value="default">General</option><option value="fan">Fan</option><option value="fridge">Fridge</option><option value="freezer">Freezer</option><option value="ac">AC</option><option value="pump">Pump</option>
              </select>
            </label>
            {!controlled ? <Button variant="danger" size="sm" onClick={() => setLoads((current) => current.filter((item) => item.id !== load.id))}><Trash2 className="h-4 w-4" /></Button> : null}
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
