import { usePersistentState } from '../../hooks/usePersistentState'
import { calculateStringConfiguration } from '../../utils/solarFormulas'
import { formatNumber } from '../../utils/format'
import { NumberInput } from '../../components/ui/Form'
import { Callout } from '../../components/ui/Callout'
import { StatCard } from '../../components/ui/Card'

export function StringConfiguration({ panelW, requiredPanels }) {
  const [state, setState] = usePersistentState('mse-string-configuration', {
    panelVoc: 45,
    panelIsc: 11,
    panelsSeries: 3,
    stringsParallel: 2,
    mpptMaxVoltage: 150,
    mpptMaxCurrent: 30,
    mpptInputs: 1,
  })
  const result = calculateStringConfiguration({ ...state, panelW, requiredPanels })
  const update = (field, value) => setState((current) => ({ ...current, [field]: value }))

  return (
    <details className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/45 p-4 dark:border-sky-400/15 dark:bg-sky-400/5">
      <summary className="cursor-pointer list-none font-heading text-base font-extrabold text-slate-950 marker:hidden dark:text-white">
        Panel String Configuration
        <span className="ml-2 text-xs font-semibold text-sky-700 dark:text-sky-300">Optional</span>
      </summary>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Check the proposed series and parallel arrangement against the stated MPPT limits before installation.</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NumberInput label="Panel Open-Circuit Voltage" value={state.panelVoc} onChange={(value) => update('panelVoc', value)} unit="V" min={0} step={0.1} />
        <NumberInput label="Panel Short-Circuit Current" value={state.panelIsc} onChange={(value) => update('panelIsc', value)} unit="A" min={0} step={0.1} />
        <NumberInput label="Panels in Series" value={state.panelsSeries} onChange={(value) => update('panelsSeries', value)} min={1} />
        <NumberInput label="Strings in Parallel" value={state.stringsParallel} onChange={(value) => update('stringsParallel', value)} min={1} />
        <NumberInput label="MPPT Maximum PV Voltage" value={state.mpptMaxVoltage} onChange={(value) => update('mpptMaxVoltage', value)} unit="V" min={1} />
        <NumberInput label="MPPT Maximum Input Current" value={state.mpptMaxCurrent} onChange={(value) => update('mpptMaxCurrent', value)} unit="A" min={1} />
        <NumberInput label="MPPT Inputs" value={state.mpptInputs} onChange={(value) => update('mpptInputs', value)} min={1} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="String Voltage" value={formatNumber(result.stringVoltage, 1)} unit="V" tone={result.voltageCompatible ? 'green' : 'red'} />
        <StatCard label="String Current" value={formatNumber(result.stringCurrent, 1)} unit="A" tone="blue" />
        <StatCard label="Array Power" value={formatNumber(result.arrayWatts)} unit="W" tone="gold" />
        <StatCard label="MPPT Allocation" value={`${result.stringsPerInput} string${result.stringsPerInput === 1 ? '' : 's'}/input`} unit={`${formatNumber(result.currentPerInput, 1)}A each`} tone={result.currentCompatible ? 'green' : 'red'} />
      </div>

      {!result.panelCountMatches ? <Callout tone="warning">This arrangement uses {result.totalPanels} panels while the PV sizing result calls for {requiredPanels}. Adjust the series or parallel count before finalising the design.</Callout> : null}
      {!result.voltageCompatible ? <Callout tone="warning">String Voc is at or above the MPPT maximum PV input. Reduce panels in series and verify cold-weather Voc in the equipment datasheet.</Callout> : null}
      {!result.currentCompatible ? <Callout tone="warning">The planned current per MPPT input exceeds the entered input limit. Add MPPT inputs or reduce parallel strings.</Callout> : null}
      {result.voltageCompatible && result.currentCompatible && result.panelCountMatches ? <Callout>The planned string configuration is within the values entered here. Confirm final Voc, Isc, and MPPT limits from the exact equipment datasheets.</Callout> : null}
    </details>
  )
}
