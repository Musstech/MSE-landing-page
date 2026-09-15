import { Plus, Trash2 } from 'lucide-react'
import { appliances } from '../../data/appliances'
import { usePersistentState } from '../../hooks/usePersistentState'
import { calculateLoad } from '../../utils/solarFormulas'
import { formatNumber } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Callout } from '../../components/ui/Callout'
import { Card, StatCard } from '../../components/ui/Card'
import { ResultBanner } from '../../components/ui/ResultBanner'
import { SectionHeader } from '../../components/ui/SectionHeader'

export const initialRows = [
  { id: 1, name: 'LED Bulb', watts: 15, qty: 6, dayH: 0, nightH: 5, duty: 'default', surge: 'default' },
  { id: 2, name: 'Ceiling Fan', watts: 75, qty: 2, dayH: 4, nightH: 4, duty: 'default', surge: 'fan' },
  { id: 3, name: 'LED TV 42"', watts: 120, qty: 1, dayH: 0, nightH: 4, duty: 'default', surge: 'default' },
  { id: 4, name: 'Refrigerator', watts: 200, qty: 1, dayH: 6, nightH: 6, duty: 'fridge', surge: 'fridge' },
]

export function LoadCalculator({ rows: controlledRows, setRows: controlledSetRows, result: controlledResult }) {
  const [storedRows, storedSetRows] = usePersistentState('mse-load-rows', initialRows)
  const rows = controlledRows ?? storedRows
  const setRows = controlledSetRows ?? storedSetRows
  const result = controlledResult ?? calculateLoad(rows)

  function updateRow(id, field, value) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  function addAppliance(item) {
    setRows((current) => [...current, { id: Date.now(), name: item.name, watts: item.w, qty: 1, dayH: 4, nightH: 4, duty: item.duty, surge: item.surge }])
  }

  return (
    <div>
      <SectionHeader
        title="Load Calculator"
        subtitle="Build a daily load schedule. Night load feeds the battery sizing; total load feeds panel sizing."
        action={<Button variant="soft" size="sm" onClick={() => setRows((current) => [...current, { id: Date.now(), name: 'Custom Appliance', watts: 100, qty: 1, dayH: 2, nightH: 2, duty: 'default', surge: 'default' }])}><Plus className="h-4 w-4" />Custom</Button>}
      />

      <Card className="mb-4 p-0">
        <div className="hidden grid-cols-[1fr_90px_70px_80px_90px_130px_44px] gap-2 rounded-t-lg bg-navy px-4 py-3 text-xs font-bold uppercase tracking-wide text-white md:grid">
          <div>Appliance</div><div>Watts</div><div>Qty</div><div>Day</div><div>Night</div><div>Surge</div><div />
        </div>
        <div className="divide-y divide-slate-100">
          {rows.map((row) => (
            <div key={row.id} className="grid gap-3 p-4 md:grid-cols-[1fr_90px_70px_80px_90px_130px_44px] md:items-center">
              <label className="block">
                <span className="mobile-row-label">Appliance</span>
                <input className="input" value={row.name} onChange={(event) => updateRow(row.id, 'name', event.target.value)} aria-label="Appliance name" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Watts</span>
                <input className="input" type="number" min="0" value={row.watts} onChange={(event) => updateRow(row.id, 'watts', Number(event.target.value))} aria-label="Watts" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Qty</span>
                <input className="input" type="number" min="0" value={row.qty} onChange={(event) => updateRow(row.id, 'qty', Number(event.target.value))} aria-label="Quantity" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Day hrs</span>
                <input className="input" type="number" min="0" max="24" step="0.5" value={row.dayH} onChange={(event) => updateRow(row.id, 'dayH', Number(event.target.value))} aria-label="Day hours" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Night hrs</span>
                <input className="input" type="number" min="0" max="24" step="0.5" value={row.nightH} onChange={(event) => updateRow(row.id, 'nightH', Number(event.target.value))} aria-label="Night hours" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Surge Type</span>
                <select className="input bg-white" value={row.surge || 'default'} onChange={(event) => updateRow(row.id, 'surge', event.target.value)} aria-label="Surge type">
                  <option value="default">General</option><option value="fan">Fan</option><option value="fridge">Fridge</option><option value="freezer">Freezer</option><option value="ac">AC</option><option value="pump">Pump</option>
                </select>
              </label>
              <Button variant="danger" size="sm" aria-label="Remove appliance" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <div className="mb-3 text-sm font-bold text-navy">Quick add from appliance database</div>
        <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto">
          {appliances.map((item) => (
            <button key={item.id} onClick={() => addAppliance(item)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-[#EEF2F7]">
              {item.name} <span className="text-slate-400">({item.w}W)</span>
            </button>
          ))}
        </div>
      </Card>

      <ResultBanner label="Total Design Load" value={formatNumber(result.design)} unit="Wh/day" sub={`Raw: ${formatNumber(result.total)} Wh x 1.25 safety margin`} />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatCard label="Daytime Load" value={formatNumber(result.dayDesign)} unit="Wh" tone="gold" />
        <StatCard label="Nighttime Load" value={formatNumber(result.nightDesign)} unit="Wh" tone="blue" />
        <StatCard label="Total Appliances" value={rows.length} unit="items" />
      </div>
      {result.design > 50000 ? <Callout tone="warning">Design load is very high. Verify appliance wattages and usage hours before sizing components.</Callout> : null}
    </div>
  )
}
