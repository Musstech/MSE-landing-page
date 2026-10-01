import { usePersistentState } from '../../hooks/usePersistentState'
import { calculateBattery } from '../../utils/solarFormulas'
import { formatNumber } from '../../utils/format'
import { NumberInput, SelectInput } from '../../components/ui/Form'
import { Callout } from '../../components/ui/Callout'
import { Card, StatCard } from '../../components/ui/Card'
import { ResultBanner } from '../../components/ui/ResultBanner'
import { SectionHeader } from '../../components/ui/SectionHeader'

export function BatteryCalculator({ nightLoad }) {
  const [state, setState] = usePersistentState('mse-battery-calc', { nightLoad: 4000, voltage: 48, battType: 'lithium', autonomy: 1, battAh: 200 })
  const linkedNightLoad = Number(nightLoad) > 0 ? Number(nightLoad) : null
  const result = calculateBattery({ ...state, nightLoad: linkedNightLoad ?? state.nightLoad })
  const update = (field, value) => setState((current) => ({ ...current, [field]: value }))

  return (
    <div>
      <SectionHeader title="Battery Bank Calculator" subtitle="Battery sizing is based on nighttime load and autonomy days." />
      <div className="grid gap-4 md:grid-cols-2">
        {linkedNightLoad ? (
          <Card className="connected-result p-4">
            <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">Nighttime Design Load</div>
            <div className="technical-value mt-1 font-heading text-2xl font-extrabold text-slate-950 dark:text-white">{formatNumber(linkedNightLoad)} <span className="text-sm font-semibold text-slate-500">Wh</span></div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Connected from the night schedule with the 25% design margin applied.</p>
          </Card>
        ) : (
          <NumberInput label="Nighttime Design Load" value={state.nightLoad} onChange={(value) => update('nightLoad', value)} unit="Wh" />
        )}
        <SelectInput label="System Voltage" value={state.voltage} onChange={(value) => update('voltage', Number(value))} options={[{ value: 12, label: '12V' }, { value: 24, label: '24V' }, { value: 48, label: '48V' }]} />
        <SelectInput label="Battery Type" value={state.battType} onChange={(value) => update('battType', value)} options={[{ value: 'lithium', label: 'Lithium LiFePO4 (80% DoD)' }, { value: 'leadAcid', label: 'Lead-Acid (50% DoD)' }, { value: 'agm', label: 'AGM/Gel (60% DoD)' }]} />
        <NumberInput label="Autonomy Days" value={state.autonomy} onChange={(value) => update('autonomy', value)} unit="days" step={0.5} min={0.5} />
        <NumberInput label="Single Battery Capacity" value={state.battAh} onChange={(value) => update('battAh', value)} unit="Ah" min={1} />
      </div>
      <div className="mt-4">
        <ResultBanner label="Batteries Required" value={result.count} unit={`x ${state.battAh}Ah ${state.voltage}V`} sub={`Total: ${formatNumber(result.totalAh)}Ah | Usable: ${formatNumber(result.usableWh)}Wh | DoD: ${Math.round(result.dod * 100)}%`} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatCard label="Required Ah" value={formatNumber(result.requiredAh)} unit="Ah" tone="gold" />
        <StatCard label="Total Bank" value={formatNumber(result.totalAh)} unit="Ah" tone="blue" />
        <StatCard label="Usable Energy" value={formatNumber(result.usableWh)} unit="Wh" tone="green" />
      </div>
      {result.count > 4 ? <Callout tone="warning">More than 4 batteries in parallel should use a proper busbar distribution system.</Callout> : null}
      {state.battType === 'leadAcid' ? <Callout tone="warning">Lead-acid batteries have lower usable capacity and cycle life than lithium batteries.</Callout> : null}
    </div>
  )
}
