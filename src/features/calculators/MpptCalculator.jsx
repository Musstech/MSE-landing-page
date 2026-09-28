import { usePersistentState } from '../../hooks/usePersistentState'
import { calculateMppt } from '../../utils/solarFormulas'
import { formatNumber } from '../../utils/format'
import { NumberInput } from '../../components/ui/Form'
import { Callout } from '../../components/ui/Callout'
import { StatCard } from '../../components/ui/Card'
import { ResultBanner } from '../../components/ui/ResultBanner'
import { SectionHeader } from '../../components/ui/SectionHeader'

export function MpptCalculator({ arrayWatts }) {
  const [state, setState] = usePersistentState('mse-mppt-calc', {
    arrayWatts: 2500,
    batteryVoltage: 48,
    controllerAmps: 60,
    panelVoc: 90,
    controllerMaxVoltage: 150,
  })
  const linkedArrayWatts = Number(arrayWatts) > 0 ? Number(arrayWatts) : null
  const result = calculateMppt({ ...state, arrayWatts: linkedArrayWatts ?? state.arrayWatts })
  const update = (field, value) => setState((current) => ({ ...current, [field]: value }))

  return (
    <div>
      <SectionHeader title="MPPT Calculator" subtitle="Check a separate MPPT controller against PV power, battery voltage, and published PV input limits." />
      <div className="grid gap-4 md:grid-cols-2">
        <NumberInput label="PV Array Power" value={linkedArrayWatts ?? state.arrayWatts} onChange={(value) => update('arrayWatts', value)} unit="W" min={0} />
        <NumberInput label="Battery Voltage" value={state.batteryVoltage} onChange={(value) => update('batteryVoltage', value)} unit="V" min={1} />
        <NumberInput label="Controller Output Rating" value={state.controllerAmps} onChange={(value) => update('controllerAmps', value)} unit="A" min={1} />
        <NumberInput label="Planned PV String Voc" value={state.panelVoc} onChange={(value) => update('panelVoc', value)} unit="V" min={0} step={0.1} />
        <NumberInput label="Controller Maximum PV Voltage" value={state.controllerMaxVoltage} onChange={(value) => update('controllerMaxVoltage', value)} unit="V" min={1} />
      </div>
      <div className="mt-4">
        <ResultBanner label="Recommended MPPT Rating" value={result.recommendedAmps} unit="A minimum" sub={`PV power divided by battery voltage: ${formatNumber(result.requiredAmps, 1)}A required output current`} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatCard label="Required Output" value={formatNumber(result.requiredAmps, 1)} unit="A" tone={result.currentCompatible ? 'green' : 'red'} />
        <StatCard label="String Voc" value={formatNumber(result.pvVoltage, 1)} unit="V" tone={result.voltageCompatible ? 'green' : 'red'} />
        <StatCard label="Controller Limit" value={formatNumber(result.maxVoltage)} unit="V" tone="blue" />
      </div>
      {!result.currentCompatible ? <Callout tone="warning">The selected controller output rating is too small for the array. Select at least the recommended controller rating.</Callout> : null}
      {!result.voltageCompatible ? <Callout tone="warning">PV string voltage must be higher than battery voltage and remain below the controller maximum PV input voltage. Confirm cold-weather Voc in the controller datasheet.</Callout> : null}
      {result.currentCompatible && result.voltageCompatible ? <Callout>MPPT checks pass for the values entered. The installation guide recommends MPPT for systems above 200W and requires confirmation against the exact controller datasheet.</Callout> : null}
    </div>
  )
}
