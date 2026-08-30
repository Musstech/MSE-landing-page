import { usePersistentState } from '../../hooks/usePersistentState'
import { calculateCost } from '../../utils/solarFormulas'
import { formatCurrency, formatNumber } from '../../utils/format'
import { NumberInput, TextInput } from '../../components/ui/Form'
import { Callout } from '../../components/ui/Callout'
import { StatCard } from '../../components/ui/Card'
import { ResultBanner } from '../../components/ui/ResultBanner'
import { SectionHeader } from '../../components/ui/SectionHeader'

export function CostCalculator() {
  const [state, setState] = usePersistentState('mse-cost-calc', { currency: '$', systemCost: 1500000, dailyKwh: 8, years: 20, maintenance: 30000, genFuelPerL: 1200 })
  const result = calculateCost(state)
  const update = (field, value) => setState((current) => ({ ...current, [field]: value }))
  const currency = state.currency || '$'

  return (
    <div>
      <SectionHeader title="Cost Per kWh Calculator" subtitle="Compare lifecycle solar cost against generator electricity." />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Currency Symbol" value={currency} onChange={(value) => update('currency', value)} />
        <NumberInput label="Total System Cost" value={state.systemCost} onChange={(value) => update('systemCost', value)} unit={currency} />
        <NumberInput label="Daily Energy Produced" value={state.dailyKwh} onChange={(value) => update('dailyKwh', value)} unit="kWh" min={0.1} />
        <NumberInput label="System Lifetime" value={state.years} onChange={(value) => update('years', value)} unit="yrs" min={1} max={30} />
        <NumberInput label="Annual Maintenance" value={state.maintenance} onChange={(value) => update('maintenance', value)} unit={currency} />
        <NumberInput label="Generator Fuel Price" value={state.genFuelPerL} onChange={(value) => update('genFuelPerL', value)} unit={`${currency}/L`} />
      </div>
      <div className="mt-4">
        <ResultBanner label="Solar Cost Per kWh" value={formatCurrency(result.solarKwh, currency)} unit="/kWh" sub={`Generator estimate: ${formatCurrency(result.genKwh, currency)} per kWh`} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatCard label="Annual Saving" value={formatCurrency(result.annualSaving, currency)} tone="green" />
        <StatCard label="Payback" value={formatNumber(result.payback, 1)} unit="years" tone="gold" />
        <StatCard label="Lifetime Saving" value={formatCurrency(result.annualSaving * state.years, currency)} tone="blue" />
      </div>
      <Callout>Use this as a sales support estimate. Update fuel price and maintenance values before presenting to a client.</Callout>
    </div>
  )
}
