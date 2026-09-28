import { useNavigate } from 'react-router-dom'
import { calculateQuote } from '../utils/solarFormulas'
import { solarRegions } from '../data/solarRegions'
import { currencyOptions, formatCurrencyOption, getCurrencyOption, getCurrencySymbol, normalizeCurrencyCode } from '../data/currencies'
import { formatCurrency, formatNumber } from '../utils/format'
import { usePersistentState } from '../hooks/usePersistentState'
import { PremiumGate } from '../components/auth/PremiumGate'
import { initialRows } from '../features/calculators/LoadCalculator'
import { Button } from '../components/ui/Button'
import { Card, StatCard } from '../components/ui/Card'
import { NumberInput, SelectInput, TextInput } from '../components/ui/Form'
import { ResultBanner } from '../components/ui/ResultBanner'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Tabs } from '../components/ui/Tabs'

const today = new Date().toISOString().slice(0, 10)

export function QuotationPage() {
  return (
    <PremiumGate featureCode="solar_quote" title="Unlock Professional Quotations">
      <QuotationBuilder />
    </PremiumGate>
  )
}

function QuotationBuilder() {
  const navigate = useNavigate()
  const [installer, setInstaller] = usePersistentState('mse-quote-installer', { companyName: '', subtitle: '', currencyCode: 'USD' })
  const [client, setClient] = usePersistentState('mse-quote-client', { name: '', projectName: '', address: '', phone: '', email: '', date: today })
  const [system, setSystem] = usePersistentState('mse-quote-system', { designLoad: 8000, nightLoad: 4000, voltage: 48, battType: 'lithium', autonomy: 1, regionId: 'global-average', psh: 5, efficiency: 75, panelW: 500, battAh: 200, panelPrice: 0, battPrice: 0, invPrice: 0 })
  const [commercial, setCommercial] = usePersistentState('mse-quote-commercial', { validityDays: 14, taxEnabled: false, taxPercent: 0, bankDetails: '', paymentTerms: 'Payment schedule to be agreed before procurement begins.', warranty: 'Product warranty follows the manufacturer warranty. Workmanship warranty should be stated by the installer.' })
  const [loadRows] = usePersistentState('mse-load-rows', initialRows)
  const [margin, setMargin] = usePersistentState('mse-quote-margin', 20)
  const [extras, setExtras] = usePersistentState('mse-quote-extras', 0)
  const [reference, setReference] = usePersistentState('mse-quote-reference', '')
  const [mode, setMode] = usePersistentState('mse-quote-mode', 'basic')
  const [advanced, setAdvanced] = usePersistentState('mse-quote-advanced', { systemType: 'Hybrid solar system', installationScope: '', panelModel: '', inverterModel: '', batteryModel: '', cableNotes: '', protectionNotes: '' })
  const quote = calculateQuote(system, extras, margin, { loads: loadRows })
  const taxAmount = commercial.taxEnabled ? quote.totalCost * (Math.max(0, Number(commercial.taxPercent) || 0) / 100) : 0
  const finalTotal = quote.totalCost + taxAmount
  const selectedCurrency = getCurrencyOption(installer.currencyCode || installer.currency)
  const currencySymbol = getCurrencySymbol(selectedCurrency.code)

  const updateInstaller = (field, value) => setInstaller((current) => ({ ...current, [field]: value }))
  const updateClient = (field, value) => setClient((current) => ({ ...current, [field]: value }))
  const updateSystem = (field, value) => setSystem((current) => ({ ...current, [field]: value }))
  const updateCommercial = (field, value) => setCommercial((current) => ({ ...current, [field]: value }))
  const updateAdvanced = (field, value) => setAdvanced((current) => ({ ...current, [field]: value }))
  const updateCurrency = (currencyCode) => {
    const option = getCurrencyOption(currencyCode)
    setInstaller((current) => ({
      ...current,
      currencyCode: normalizeCurrencyCode(option.code),
      currency: option.symbol,
    }))
  }
  const updateRegion = (regionId) => {
    const region = solarRegions.find((item) => item.id === regionId)
    setSystem((current) => ({
      ...current,
      regionId,
      psh: regionId === 'custom' ? current.psh : region?.psh || current.psh,
    }))
  }
  const openPreview = () => {
    navigate('/quotation/preview')
  }

  return (
    <div>
      <SectionHeader title="Quotation Generator" subtitle="Build a clean client quotation from your connected design and commercial details." />
      <Tabs tabs={[{ id: 'basic', label: 'Basic Quotation' }, { id: 'advanced', label: 'Advanced Quotation' }]} active={mode} onChange={setMode} />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <h3 className="mb-4 font-heading font-extrabold text-slate-950 dark:text-white">Installer Profile</h3>
          <div className="grid gap-4">
            <TextInput label="Company Name" value={installer.companyName} onChange={(value) => updateInstaller('companyName', value)} />
            <TextInput label="Company Subtitle" value={installer.subtitle ?? installer.tagline ?? ''} onChange={(value) => updateInstaller('subtitle', value)} />
            <SelectInput label="Country / Currency" value={selectedCurrency.code} onChange={updateCurrency} options={currencyOptions.map((option) => ({ value: option.code, label: formatCurrencyOption(option) }))} />
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-heading font-extrabold text-slate-950 dark:text-white">Client Details</h3>
          <div className="grid gap-4">
            <TextInput label="Client Name" value={client.name} onChange={(value) => updateClient('name', value)} />
            <TextInput label="Project Name" value={client.projectName || ''} onChange={(value) => updateClient('projectName', value)} />
            <TextInput label="Site Address" value={client.address} onChange={(value) => updateClient('address', value)} />
            <TextInput label="Phone Number" value={client.phone} onChange={(value) => updateClient('phone', value)} />
            <TextInput label="Email" value={client.email} onChange={(value) => updateClient('email', value)} />
            <TextInput label="Date" type="date" value={client.date} onChange={(value) => updateClient('date', value)} />
            <TextInput label="Quotation Reference" value={reference} onChange={setReference} />
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-heading font-extrabold text-slate-950 dark:text-white">System Parameters</h3>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-sky-50/70 p-4 dark:bg-sky-400/10">
                <div className="text-[11px] font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">Design Load</div>
                <div className="mt-1 font-heading text-xl font-extrabold text-slate-950 dark:text-white">{formatNumber(quote.designLoad)} <span className="text-xs font-semibold text-slate-500">Wh/day</span></div>
              </div>
              <div className="rounded-2xl bg-sky-50/70 p-4 dark:bg-sky-400/10">
                <div className="text-[11px] font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">Night Load</div>
                <div className="mt-1 font-heading text-xl font-extrabold text-slate-950 dark:text-white">{formatNumber(quote.nightLoad)} <span className="text-xs font-semibold text-slate-500">Wh</span></div>
              </div>
            </div>
            <SelectInput label="System Voltage" value={system.voltage} onChange={(value) => updateSystem('voltage', Number(value))} options={[12, 24, 48].map((value) => ({ value, label: `${value}V` }))} />
            <SelectInput label="Battery Type" value={system.battType} onChange={(value) => updateSystem('battType', value)} options={[{ value: 'lithium', label: 'Lithium LiFePO4' }, { value: 'leadAcid', label: 'Lead-Acid' }, { value: 'agm', label: 'AGM/Gel' }]} />
            <SelectInput label="Solar Location / PSH" value={system.regionId || 'global-average'} onChange={updateRegion} options={solarRegions.map((region) => ({ value: region.id, label: `${region.label} (${region.psh} PSH)` }))} />
            <NumberInput label="Peak Sun Hours" value={system.psh || 5} onChange={(value) => updateSystem('psh', value)} unit="hrs" step={0.5} min={1} max={8} />
            <NumberInput label="Autonomy Days" value={system.autonomy} onChange={(value) => updateSystem('autonomy', value)} unit="days" step={0.5} />
            <NumberInput label="Panel Wattage" value={system.panelW} onChange={(value) => updateSystem('panelW', value)} unit="W" min={1} />
            <NumberInput label="Battery Capacity" value={system.battAh} onChange={(value) => updateSystem('battAh', value)} unit="Ah" min={1} />
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <h3 className="mb-4 font-heading font-extrabold text-slate-950 dark:text-white">Equipment Pricing</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <NumberInput label={`Panel Price (${system.panelW}W)`} value={system.panelPrice} onChange={(value) => updateSystem('panelPrice', value)} unit={currencySymbol} />
          <NumberInput label={`Battery Price (${system.battAh}Ah)`} value={system.battPrice} onChange={(value) => updateSystem('battPrice', value)} unit={currencySymbol} />
          <NumberInput label="Inverter Price" value={system.invPrice} onChange={(value) => updateSystem('invPrice', value)} unit={currencySymbol} />
          <NumberInput label="Extras" value={extras} onChange={setExtras} unit={currencySymbol} />
          <NumberInput label="Profit Margin" value={margin} onChange={setMargin} unit="%" min={0} max={100} />
        </div>
      </Card>

      {mode === 'advanced' ? (
        <PremiumGate featureCode="advanced_reports" title="Unlock Advanced Quotations">
          <Card className="mt-5">
            <h3 className="mb-2 font-heading font-extrabold text-slate-950 dark:text-white">Advanced Project Details</h3>
            <p className="mb-4 text-sm leading-6 text-slate-500 dark:text-slate-400">Add the technical and scope details that should appear in the extended client document.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <TextInput label="System Type" value={advanced.systemType} onChange={(value) => updateAdvanced('systemType', value)} />
              <TextInput label="Panel Model" value={advanced.panelModel} onChange={(value) => updateAdvanced('panelModel', value)} />
              <TextInput label="Battery Model" value={advanced.batteryModel} onChange={(value) => updateAdvanced('batteryModel', value)} />
              <TextInput label="Inverter Model" value={advanced.inverterModel} onChange={(value) => updateAdvanced('inverterModel', value)} />
              <TextInput label="Cable Details" value={advanced.cableNotes} onChange={(value) => updateAdvanced('cableNotes', value)} />
              <TextInput label="Protection Details" value={advanced.protectionNotes} onChange={(value) => updateAdvanced('protectionNotes', value)} />
              <TextInput label="Installation Scope" value={advanced.installationScope} onChange={(value) => updateAdvanced('installationScope', value)} />
            </div>
          </Card>
        </PremiumGate>
      ) : null}

      <Card className="mt-5">
        <h3 className="mb-4 font-heading font-extrabold text-slate-950 dark:text-white">Quotation Terms</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <NumberInput label="Validity" value={commercial.validityDays} onChange={(value) => updateCommercial('validityDays', value)} unit="days" min={1} />
          <SelectInput label="Include Tax" value={commercial.taxEnabled ? 'yes' : 'no'} onChange={(value) => updateCommercial('taxEnabled', value === 'yes')} options={[{ value: 'no', label: 'No tax' }, { value: 'yes', label: 'Add tax/VAT' }]} />
          <NumberInput label="Tax Rate" value={commercial.taxPercent} onChange={(value) => updateCommercial('taxPercent', value)} unit="%" min={0} max={100} />
          <TextInput label="Payment Terms" value={commercial.paymentTerms} onChange={(value) => updateCommercial('paymentTerms', value)} />
          <TextInput label="Warranty Wording" value={commercial.warranty} onChange={(value) => updateCommercial('warranty', value)} />
          <TextInput label="Bank Details (Optional)" value={commercial.bankDetails} onChange={(value) => updateCommercial('bankDetails', value)} />
        </div>
      </Card>

      <div className="mt-5">
        <ResultBanner label="Client Total Price" value={formatCurrency(finalTotal, currencySymbol)} sub={`Equipment cost: ${formatCurrency(quote.equipCost, currencySymbol)} | Margin: ${formatNumber(margin)}%${commercial.taxEnabled ? ` | Tax: ${formatCurrency(taxAmount, currencySymbol)}` : ''}`} />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <StatCard label="Solar Panels" value={`${quote.panels} x ${system.panelW}W`} tone="gold" />
          <StatCard label="Battery Bank" value={`${quote.batteries} x ${system.battAh}Ah`} tone="blue" />
          <StatCard label="Inverter" value={`${formatNumber(quote.inverterWatts / 1000, 1)} kVA`} tone="green" />
        </div>
      </div>

      <Button className="mt-5 w-full" variant="primary" size="lg" onClick={openPreview}>Open Quotation Preview</Button>
    </div>
  )
}
