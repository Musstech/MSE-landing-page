import { usePersistentState } from '../../hooks/usePersistentState'
import { calculatePanels } from '../../utils/solarFormulas'
import { formatNumber } from '../../utils/format'
import { NumberInput } from '../../components/ui/Form'
import { Callout } from '../../components/ui/Callout'
import { StatCard } from '../../components/ui/Card'
import { ResultBanner } from '../../components/ui/ResultBanner'
import { SectionHeader } from '../../components/ui/SectionHeader'

export function PanelCalculator() {
  const [state, setState] = usePersistentState('mse-panel-calc', { designLoad: 8000, panelW: 500, psh: 5, efficiency: 75 })
  const result = calculatePanels(state)
  const update = (field, value) => setState((current) => ({ ...current, [field]: value }))

  return (
    <div>
      <SectionHeader title="Panel Sizing Calculator" subtitle="Convert design load into the required PV array size." />
      <div className="grid gap-4 md:grid-cols-2">
        <NumberInput label="Total Design Load" value={state.designLoad} onChange={(value) => update('designLoad', value)} unit="Wh" />
        <NumberInput label="Panel Wattage" value={state.panelW} onChange={(value) => update('panelW', value)} unit="W" min={1} />
        <NumberInput label="Peak Sun Hours" value={state.psh} onChange={(value) => update('psh', value)} unit="hrs" step={0.5} min={1} max={8} />
        <NumberInput label="System Efficiency" value={state.efficiency} onChange={(value) => update('efficiency', value)} unit="%" min={50} max={100} />
      </div>
      <div className="mt-4">
        <ResultBanner label="Panels Required" value={result.count} unit={`x ${state.panelW}W panels`} sub={`Array total: ${formatNumber(result.arrayWatts)}W | Efficiency factor: ${formatNumber(result.factor, 2)}`} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatCard label="Panel Capacity" value={formatNumber(result.capacity)} unit="W" tone="gold" />
        <StatCard label="Array Total" value={formatNumber(result.arrayWatts)} unit="W" tone="blue" />
        <StatCard label="Daily Output" value={formatNumber(result.dailyOutput)} unit="Wh" tone="green" />
      </div>
      <Callout>Always round panel count up. Apply real-world efficiency instead of theoretical panel output.</Callout>
    </div>
  )
}

