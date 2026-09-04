import { useMemo } from 'react'
import { Compass, SunMedium } from 'lucide-react'
import { usePersistentState } from '../hooks/usePersistentState'
import { Card, StatCard } from '../components/ui/Card'
import { NumberInput, SelectInput, TextInput } from '../components/ui/Form'
import { ResultBanner } from '../components/ui/ResultBanner'
import { SectionHeader } from '../components/ui/SectionHeader'
import { formatNumber } from '../utils/format'

const orientations = [
  { value: 'south', label: 'South-facing / northern hemisphere', score: 1 },
  { value: 'north', label: 'North-facing / southern hemisphere', score: 1 },
  { value: 'east-west', label: 'East-west split', score: 0.86 },
  { value: 'east', label: 'East-facing', score: 0.76 },
  { value: 'west', label: 'West-facing', score: 0.76 },
  { value: 'shaded', label: 'Shaded or blocked area', score: 0.55 },
]

export function SolarNavigatorPage() {
  const [state, setState] = usePersistentState('mse-solar-navigator', {
    location: '',
    roofLength: 8,
    roofWidth: 5,
    roofTilt: 15,
    orientation: 'south',
    panelW: 550,
    panelWidth: 1.13,
    panelHeight: 2.28,
    psh: 5,
  })
  const update = (field, value) => setState((current) => ({ ...current, [field]: value }))
  const result = useMemo(() => {
    const roofArea = Math.max(0, state.roofLength * state.roofWidth)
    const panelArea = Math.max(0.1, state.panelWidth * state.panelHeight)
    const serviceFactor = 0.82
    const fit = Math.max(0, Math.floor((roofArea * serviceFactor) / panelArea))
    const arrayKw = (fit * state.panelW) / 1000
    const orientation = orientations.find((item) => item.value === state.orientation) || orientations[0]
    const tiltScore = state.roofTilt >= 8 && state.roofTilt <= 30 ? 1 : 0.9
    const dailyYield = arrayKw * state.psh * orientation.score * tiltScore
    const status = orientation.value === 'shaded' ? 'Needs review' : orientation.score >= 0.86 ? 'Recommended' : 'Acceptable'
    return { roofArea, panelArea, fit, arrayKw, dailyYield, status, orientation }
  }, [state])

  return (
    <div>
      <SectionHeader title="Solar Navigator" subtitle="Estimate suitable panel placement, roof capacity, and expected daily array output." />
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Placement Inputs</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="City / Site Area" value={state.location} onChange={(value) => update('location', value)} />
            <SelectInput label="Roof Orientation" value={state.orientation} onChange={(value) => update('orientation', value)} options={orientations.map(({ value, label }) => ({ value, label }))} />
            <NumberInput label="Usable Roof Length" value={state.roofLength} onChange={(value) => update('roofLength', value)} unit="m" step={0.1} min={0.1} />
            <NumberInput label="Usable Roof Width" value={state.roofWidth} onChange={(value) => update('roofWidth', value)} unit="m" step={0.1} min={0.1} />
            <NumberInput label="Roof Tilt" value={state.roofTilt} onChange={(value) => update('roofTilt', value)} unit="deg" min={0} max={60} />
            <NumberInput label="Peak Sun Hours" value={state.psh} onChange={(value) => update('psh', value)} unit="hrs" step={0.5} min={1} max={8} />
            <NumberInput label="Panel Wattage" value={state.panelW} onChange={(value) => update('panelW', value)} unit="W" min={1} />
            <NumberInput label="Panel Width" value={state.panelWidth} onChange={(value) => update('panelWidth', value)} unit="m" step={0.01} min={0.1} />
            <NumberInput label="Panel Height" value={state.panelHeight} onChange={(value) => update('panelHeight', value)} unit="m" step={0.01} min={0.1} />
          </div>
        </Card>

        <div className="space-y-4">
          <ResultBanner label="Placement Status" value={result.status} sub={`${result.fit} panels estimated for ${formatNumber(result.roofArea, 1)}m² usable roof area`} />
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Panels That Fit" value={result.fit} tone="blue" />
            <StatCard label="Array Rating" value={formatNumber(result.arrayKw, 2)} unit="kWp" tone="green" />
            <StatCard label="Estimated Output" value={formatNumber(result.dailyYield, 1)} unit="kWh/day" tone="gold" />
            <StatCard label="Orientation Factor" value={formatNumber(result.orientation.score * 100)} unit="%" tone="navy" />
          </div>
          <Card>
            <div className="flex items-center gap-2 font-heading text-base font-bold text-slate-950 dark:text-white">
              <SunMedium className="h-5 w-5 text-sky-600" />
              Placement Guidance
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Keep the selected roof section clear of shade during peak sun hours. Leave service space for maintenance, cable runs, and roof edge setbacks before final installation.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
