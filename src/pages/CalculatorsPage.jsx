import { useState } from 'react'
import { Tabs } from '../components/ui/Tabs'
import { LoadCalculator } from '../features/calculators/LoadCalculator'
import { PanelCalculator } from '../features/calculators/PanelCalculator'
import { BatteryCalculator } from '../features/calculators/BatteryCalculator'
import { InverterCalculator } from '../features/calculators/InverterCalculator'
import { CableCalculator } from '../features/calculators/CableCalculator'
import { CostCalculator } from '../features/calculators/CostCalculator'

const tabs = [
  { id: 'load', label: 'Load' },
  { id: 'panel', label: 'Panel' },
  { id: 'battery', label: 'Battery' },
  { id: 'inverter', label: 'Inverter' },
  { id: 'cable', label: 'Cable' },
  { id: 'cost', label: 'Cost/kWh' },
]

export function CalculatorsPage() {
  const [tab, setTab] = useState('load')

  return (
    <div>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'load' && <LoadCalculator />}
      {tab === 'panel' && <PanelCalculator />}
      {tab === 'battery' && <BatteryCalculator />}
      {tab === 'inverter' && <InverterCalculator />}
      {tab === 'cable' && <CableCalculator />}
      {tab === 'cost' && <CostCalculator />}
    </div>
  )
}

