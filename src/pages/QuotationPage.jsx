import { useMemo, useState } from 'react'
import { calculateQuote } from '../utils/solarFormulas'
import { solarRegions } from '../data/solarRegions'
import { formatCurrency, formatNumber } from '../utils/format'
import { usePersistentState } from '../hooks/usePersistentState'
import { Button } from '../components/ui/Button'
import { Card, StatCard } from '../components/ui/Card'
import { NumberInput, SelectInput, TextInput } from '../components/ui/Form'
import { ResultBanner } from '../components/ui/ResultBanner'
import { SectionHeader } from '../components/ui/SectionHeader'
import { QuotePreview } from '../features/quotation/QuotePreview'

const today = new Date().toISOString().slice(0, 10)

export function QuotationPage() {
  const [client, setClient] = usePersistentState('mse-quote-client', { name: '', address: '', phone: '', email: '', date: today })
  const [system, setSystem] = usePersistentState('mse-quote-system', { designLoad: 8000, nightLoad: 4000, voltage: 48, battType: 'lithium', autonomy: 1, regionId: 'nigeria-average', psh: 5, efficiency: 75, panelW: 500, battAh: 200, panelPrice: 145000, battPrice: 480000, invPrice: 520000 })
  const [margin, setMargin] = usePersistentState('mse-quote-margin', 20)
  const [extras, setExtras] = usePersistentState('mse-quote-extras', 150000)
  const [shown, setShown] = useState(false)
  const reference = useMemo(() => `MSE-${Date.now().toString().slice(-6)}`, [shown])
  const quote = calculateQuote(system, extras, margin)

  const updateClient = (field, value) => setClient((current) => ({ ...current, [field]: value }))
  const updateSystem = (field, value) => setSystem((current) => ({ ...current, [field]: value }))
  const updateRegion = (regionId) => {
    const region = solarRegions.find((item) => item.id === regionId)
    setSystem((current) => ({
      ...current,
      regionId,
      psh: regionId === 'custom' ? current.psh : region?.psh || current.psh,
    }))
  }

  return (
    <div>
      <SectionHeader title="Quotation Generator" subtitle="Auto-size system components and prepare a clean client quotation." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-heading font-extrabold text-navy">Client Details</h3>
          <div className="grid gap-4">
            <TextInput label="Client Name" value={client.name} onChange={(value) => updateClient('name', value)} />
            <TextInput label="Site Address" value={client.address} onChange={(value) => updateClient('address', value)} />
            <TextInput label="Phone Number" value={client.phone} onChange={(value) => updateClient('phone', value)} />
            <TextInput label="Email" value={client.email} onChange={(value) => updateClient('email', value)} />
            <TextInput label="Date" type="date" value={client.date} onChange={(value) => updateClient('date', value)} />
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-heading font-extrabold text-navy">System Parameters</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Total Design Load" value={system.designLoad} onChange={(value) => updateSystem('designLoad', value)} unit="Wh" />
            <NumberInput label="Nighttime Load" value={system.nightLoad} onChange={(value) => updateSystem('nightLoad', value)} unit="Wh" />
            <SelectInput label="System Voltage" value={system.voltage} onChange={(value) => updateSystem('voltage', Number(value))} options={[12, 24, 48].map((value) => ({ value, label: `${value}V` }))} />
            <SelectInput label="Battery Type" value={system.battType} onChange={(value) => updateSystem('battType', value)} options={[{ value: 'lithium', label: 'Lithium LiFePO4' }, { value: 'leadAcid', label: 'Lead-Acid' }, { value: 'agm', label: 'AGM/Gel' }]} />
            <SelectInput label="Solar Location / PSH" value={system.regionId || 'nigeria-average'} onChange={updateRegion} options={solarRegions.map((region) => ({ value: region.id, label: `${region.label} (${region.psh} PSH)` }))} />
            <NumberInput label="Peak Sun Hours" value={system.psh || 5} onChange={(value) => updateSystem('psh', value)} unit="hrs" step={0.5} min={1} max={8} />
            <NumberInput label="Autonomy Days" value={system.autonomy} onChange={(value) => updateSystem('autonomy', value)} unit="days" step={0.5} />
            <NumberInput label="Panel Wattage" value={system.panelW} onChange={(value) => updateSystem('panelW', value)} unit="W" min={1} />
            <NumberInput label="Battery Capacity" value={system.battAh} onChange={(value) => updateSystem('battAh', value)} unit="Ah" min={1} />
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <h3 className="mb-4 font-heading font-extrabold text-navy">Equipment Pricing</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <NumberInput label={`Panel Price (${system.panelW}W)`} value={system.panelPrice} onChange={(value) => updateSystem('panelPrice', value)} unit="NGN" />
          <NumberInput label={`Battery Price (${system.battAh}Ah)`} value={system.battPrice} onChange={(value) => updateSystem('battPrice', value)} unit="NGN" />
          <NumberInput label="Inverter Price" value={system.invPrice} onChange={(value) => updateSystem('invPrice', value)} unit="NGN" />
          <NumberInput label="Extras" value={extras} onChange={setExtras} unit="NGN" />
          <NumberInput label="Profit Margin" value={margin} onChange={setMargin} unit="%" min={0} max={100} />
        </div>
      </Card>

      <div className="mt-5">
        <ResultBanner label="Client Total Price" value={formatCurrency(quote.totalCost)} sub={`Equipment cost: ${formatCurrency(quote.equipCost)} | Margin: ${formatNumber(margin)}%`} />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <StatCard label="Solar Panels" value={`${quote.panels} x ${system.panelW}W`} tone="gold" />
          <StatCard label="Battery Bank" value={`${quote.batteries} x ${system.battAh}Ah`} tone="blue" />
          <StatCard label="Inverter" value={`${formatNumber(quote.inverterWatts / 1000, 1)} kVA`} tone="green" />
        </div>
      </div>

      <Button className="mt-5 w-full" variant="primary" size="lg" onClick={() => setShown(true)}>Generate Quotation Preview</Button>
      {shown ? <div className="mt-6"><QuotePreview client={client} system={system} extras={extras} margin={margin} reference={reference} /></div> : null}
    </div>
  )
}
