import { usePersistentState } from '../../hooks/usePersistentState'
import { calculateCable } from '../../utils/solarFormulas'
import { formatNumber } from '../../utils/format'
import { NumberInput, SelectInput } from '../../components/ui/Form'
import { Callout } from '../../components/ui/Callout'
import { StatCard } from '../../components/ui/Card'
import { ResultBanner } from '../../components/ui/ResultBanner'
import { SectionHeader } from '../../components/ui/SectionHeader'

export function CableCalculator() {
  const [state, setState] = usePersistentState('mse-cable-calc', { power: 5000, voltage: 48, circuitType: 'dc', length: 3, cableSize: '35' })
  const result = calculateCable(state)
  const update = (field, value) => setState((current) => ({ ...current, [field]: value }))

  return (
    <div>
      <SectionHeader title="Cable & Breaker Calculator" subtitle="Check circuit current, breaker size, and voltage drop." />
      <div className="grid gap-4 md:grid-cols-2">
        <SelectInput label="Circuit Type" value={state.circuitType} onChange={(value) => update('circuitType', value)} options={[{ value: 'dc', label: 'DC battery/PV circuit' }, { value: 'ac', label: 'AC inverter output' }]} />
        <NumberInput label="Power" value={state.power} onChange={(value) => update('power', value)} unit="W" />
        <NumberInput label="Voltage" value={state.voltage} onChange={(value) => update('voltage', value)} unit="V" min={1} />
        <SelectInput label="Cable Size" value={state.cableSize} onChange={(value) => update('cableSize', value)} options={['1.5', '2.5', '4', '6', '10', '16', '25', '35', '50', '70'].map((size) => ({ value: size, label: `${size}mm2` }))} />
        <NumberInput label="Cable Run Length" value={state.length} onChange={(value) => update('length', value)} unit="m" />
      </div>
      <div className="mt-4">
        <ResultBanner label="Circuit Current" value={formatNumber(result.current, 1)} unit="A" />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={result.protectionLabel} value={`${result.breaker}A`} tone="gold" />
        <StatCard label="Cable Guide" value={`${result.recommendedCable}mm2`} tone={Number(state.cableSize) < result.recommendedCable ? 'red' : 'green'} />
        <StatCard label="Voltage Drop" value={formatNumber(result.dropV, 2)} unit="V" tone={result.dropPct > result.maxDrop ? 'red' : 'green'} />
        <StatCard label="Drop Percent" value={formatNumber(result.dropPct, 1)} unit="%" tone={result.dropPct > result.maxDrop ? 'red' : 'green'} />
      </div>
      {Number(state.cableSize) < result.recommendedCable ? <Callout tone="warning">The selected cable is below the guide’s {result.recommendedCable}mm2 recommendation for this current. Increase the conductor size and verify its installation rating.</Callout> : null}
      {result.dropPct > result.maxDrop ? <Callout tone="warning">Voltage drop exceeds the recommended {result.maxDrop}% maximum. Use a larger cable or reduce run length.</Callout> : <Callout>{state.circuitType === 'dc' ? 'Use a DC-rated fuse or breaker close to the battery positive terminal. ' : 'Use an AC-rated output breaker matched to the inverter output. '}Voltage drop is within the recommended {result.maxDrop}% maximum.</Callout>}
    </div>
  )
}

