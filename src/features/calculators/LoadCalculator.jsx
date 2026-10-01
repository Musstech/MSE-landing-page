import { useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { appliances } from '../../data/appliances'
import { usePersistentState } from '../../hooks/usePersistentState'
import { calculateLoad } from '../../utils/solarFormulas'
import { formatNumber } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Callout } from '../../components/ui/Callout'
import { Card, StatCard } from '../../components/ui/Card'
import { ResultBanner } from '../../components/ui/ResultBanner'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { numericInputValue } from '../../components/ui/Form'

export const initialRows = [
  { id: 1, applianceId: 'none', name: 'None', watts: 0, qty: 0, dayH: 1, nightH: 1, duty: 'none', surge: 'none' },
  { id: 2, applianceId: 'none', name: 'None', watts: 0, qty: 0, dayH: 0, nightH: 0, duty: 'none', surge: 'none' },
]

const applianceCategories = ['All', ...new Set(appliances.filter((item) => item.id !== 'none').map((item) => item.cat))]

function createCustomDraft() {
  return { name: '', watts: '', qty: 1, dayH: 1, nightH: 1, surge: 'none' }
}

export function LoadCalculator({ rows: controlledRows, setRows: controlledSetRows, result: controlledResult }) {
  const [storedRows, storedSetRows] = usePersistentState('mse-load-rows', initialRows)
  const rows = controlledRows ?? storedRows
  const setRows = controlledSetRows ?? storedSetRows
  const result = controlledResult ?? calculateLoad(rows)
  const [customOpen, setCustomOpen] = useState(false)
  const [customDraft, setCustomDraft] = useState(createCustomDraft)
  const [libraryQuery, setLibraryQuery] = useState('')
  const [libraryCategory, setLibraryCategory] = useState('All')

  function updateRow(id, field, value) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  function addAppliance(item) {
    setRows((current) => [...current, { id: Date.now(), applianceId: item.id, name: item.name, watts: item.w, qty: item.id === 'none' ? 0 : 1, dayH: 1, nightH: 1, duty: item.duty, surge: item.surge === 'default' ? 'none' : item.surge }])
  }

  function selectedApplianceId(row) {
    return row.applianceId || appliances.find((item) => item.name === row.name)?.id || 'custom'
  }

  function selectAppliance(row, applianceId) {
    const appliance = appliances.find((item) => item.id === applianceId)
    if (!appliance) return
    setRows((current) => current.map((item) => item.id === row.id ? {
      ...item,
      applianceId,
      name: appliance.name,
      watts: appliance.w,
      qty: applianceId === 'none' ? 0 : Math.max(1, Number(item.qty) || 1),
      duty: appliance.duty,
      surge: appliance.surge === 'default' ? 'none' : appliance.surge,
    } : item))
  }

  const hasCustomAppliance = rows.some((row) => selectedApplianceId(row) === 'custom')
  const normalizedQuery = libraryQuery.trim().toLowerCase()
  const libraryAppliances = appliances.filter((item) => item.id !== 'none' && (libraryCategory === 'All' || item.cat === libraryCategory) && (!normalizedQuery || item.name.toLowerCase().includes(normalizedQuery)))
  const customPreview = (Number(customDraft.watts) || 0) * (Number(customDraft.qty) || 0) * ((Number(customDraft.dayH) || 0) + (Number(customDraft.nightH) || 0))

  function updateCustomDraft(field, value) {
    setCustomDraft((current) => ({ ...current, [field]: value }))
  }

  function addCustomAppliance(event) {
    event.preventDefault()
    const name = customDraft.name.trim()
    const watts = Number(customDraft.watts)
    if (!name || !Number.isFinite(watts) || watts <= 0) return

    setRows((current) => [...current, {
      id: Date.now(),
      applianceId: 'custom',
      name,
      watts: customDraft.watts,
      qty: customDraft.qty,
      dayH: customDraft.dayH,
      nightH: customDraft.nightH,
      duty: 'default',
      surge: customDraft.surge,
    }])
    setCustomDraft(createCustomDraft())
    setCustomOpen(false)
  }

  return (
    <div className="load-designer">
      <div className="load-designer-head">
        <SectionHeader
          title="Load Calculator"
          subtitle="Build a daily load schedule. Night load feeds battery sizing; your complete design load feeds the panel calculation."
          action={<Button variant="soft" size="sm" disabled={hasCustomAppliance} title={hasCustomAppliance ? 'Edit the custom appliance already in your schedule.' : undefined} onClick={() => setCustomOpen(true)}><Plus className="h-4 w-4" />Custom appliance</Button>}
        />
      </div>

      {customOpen ? (
        <Card className="custom-appliance-form mb-4">
          <div className="custom-appliance-form-heading">
            <div>
              <div className="eyebrow">Custom load</div>
              <h3>Add an appliance not listed in the library.</h3>
              <p>Its energy is calculated from the values you enter and added to the same design load immediately.</p>
            </div>
            <button className="text-link text-sm" type="button" onClick={() => { setCustomOpen(false); setCustomDraft(createCustomDraft()) }}>Cancel</button>
          </div>
          <form className="mt-5 grid gap-3 md:grid-cols-6" onSubmit={addCustomAppliance}>
            <label className="block md:col-span-2"><span className="mobile-row-label">Appliance name</span><input className="input" value={customDraft.name} onChange={(event) => updateCustomDraft('name', event.target.value)} placeholder="e.g. Borehole controller" autoFocus /></label>
            <label className="block"><span className="mobile-row-label">Watts</span><input className="input technical-input" type="number" min="0" value={customDraft.watts} onChange={(event) => updateCustomDraft('watts', numericInputValue(event.target.value))} placeholder="0" /></label>
            <label className="block"><span className="mobile-row-label">Qty</span><input className="input technical-input" type="number" min="0" value={customDraft.qty} onChange={(event) => updateCustomDraft('qty', numericInputValue(event.target.value))} /></label>
            <label className="block"><span className="mobile-row-label">Day hrs</span><input className="input technical-input" type="number" min="0" max="24" step="0.5" value={customDraft.dayH} onChange={(event) => updateCustomDraft('dayH', numericInputValue(event.target.value))} /></label>
            <label className="block"><span className="mobile-row-label">Night hrs</span><input className="input technical-input" type="number" min="0" max="24" step="0.5" value={customDraft.nightH} onChange={(event) => updateCustomDraft('nightH', numericInputValue(event.target.value))} /></label>
            <label className="block md:col-span-2"><span className="mobile-row-label">Surge type</span><select className="input select-input" value={customDraft.surge} onChange={(event) => updateCustomDraft('surge', event.target.value)}><option value="none">None</option><option value="fan">Fan</option><option value="fridge">Fridge</option><option value="freezer">Freezer</option><option value="ac">AC</option><option value="pump">Pump</option></select></label>
            <div className="custom-load-preview md:col-span-2"><span>Daily load preview</span><strong>{formatNumber(customPreview)} Wh</strong></div>
            <Button className="md:col-span-2" type="submit" disabled={!customDraft.name.trim() || Number(customDraft.watts) <= 0}>Add to design<Plus className="h-4 w-4" /></Button>
          </form>
        </Card>
      ) : null}

      <Card className="data-grid mb-4 overflow-hidden p-0">
        <div className="data-grid-head hidden grid-cols-[1fr_90px_70px_80px_90px_130px_44px] gap-2 px-4 py-3 text-xs font-semibold md:grid">
          <div>Appliance</div><div>Watts</div><div>Qty</div><div>Day</div><div>Night</div><div>Surge</div><div />
        </div>
        <div className="divide-y divide-slate-100">
          {rows.map((row) => (
            <div key={row.id} className="data-grid-row grid gap-3 p-4 md:grid-cols-[1fr_90px_70px_80px_90px_130px_44px] md:items-center">
              <label className="block">
                <span className="mobile-row-label">{selectedApplianceId(row) === 'custom' ? 'Custom appliance' : 'Appliance'}</span>
                {selectedApplianceId(row) === 'custom' ? <input className="input" value={row.name} onChange={(event) => updateRow(row.id, 'name', event.target.value)} aria-label="Custom appliance name" /> : <select className="input select-input" value={selectedApplianceId(row)} onChange={(event) => selectAppliance(row, event.target.value)} aria-label="Appliance">{appliances.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>}
              </label>
              <label className="block">
                <span className="mobile-row-label">Watts</span>
                <input className="input technical-input" type="number" min="0" value={row.watts ?? ''} onChange={(event) => updateRow(row.id, 'watts', numericInputValue(event.target.value))} aria-label="Watts" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Qty</span>
                <input className="input technical-input" type="number" min="0" value={row.qty ?? ''} onChange={(event) => updateRow(row.id, 'qty', numericInputValue(event.target.value))} aria-label="Quantity" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Day hrs</span>
                <input className="input technical-input" type="number" min="0" max="24" step="0.5" value={row.dayH ?? ''} onChange={(event) => updateRow(row.id, 'dayH', numericInputValue(event.target.value))} aria-label="Day hours" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Night hrs</span>
                <input className="input technical-input" type="number" min="0" max="24" step="0.5" value={row.nightH ?? ''} onChange={(event) => updateRow(row.id, 'nightH', numericInputValue(event.target.value))} aria-label="Night hours" />
              </label>
              <label className="block">
                <span className="mobile-row-label">Surge Type</span>
                <select className="input select-input" value={row.surge === 'default' ? 'none' : row.surge || 'none'} onChange={(event) => updateRow(row.id, 'surge', event.target.value)} aria-label="Surge type">
                  <option value="none">None</option><option value="fan">Fan</option><option value="fridge">Fridge</option><option value="freezer">Freezer</option><option value="ac">AC</option><option value="pump">Pump</option>
                </select>
              </label>
              <Button variant="danger" size="sm" aria-label="Remove appliance" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="appliance-library mb-4">
        <div className="appliance-library-head">
          <div><div className="eyebrow">Appliance library</div><h3>Start with typical equipment values.</h3></div>
          <label className="library-search"><Search className="h-4 w-4" /><input value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} placeholder="Find an appliance" aria-label="Find an appliance" /></label>
        </div>
        <div className="appliance-category-list" role="tablist" aria-label="Appliance categories">
          {applianceCategories.map((category) => <button key={category} type="button" role="tab" aria-selected={libraryCategory === category} className={libraryCategory === category ? 'appliance-category-active' : ''} onClick={() => setLibraryCategory(category)}>{category}</button>)}
        </div>
        <div className="appliance-library-grid">
          {libraryAppliances.map((item) => <button key={item.id} type="button" className="appliance-library-item" onClick={() => addAppliance(item)}><span className="appliance-library-initial">{item.name[0]}</span><span className="min-w-0 flex-1 text-left"><strong>{item.name}</strong><small>{item.cat} <span>{item.w} W</span></small></span><Plus className="h-4 w-4" /></button>)}
          {!libraryAppliances.length ? <p className="appliance-library-empty">No appliance matches that search.</p> : null}
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
