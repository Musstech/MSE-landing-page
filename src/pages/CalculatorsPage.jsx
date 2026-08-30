import { useState } from 'react'
import { Tabs } from '../components/ui/Tabs'
import { PremiumGate, usePremiumAccess } from '../components/auth/PremiumAccess'
import { LoadCalculator } from '../features/calculators/LoadCalculator'
import { PanelCalculator } from '../features/calculators/PanelCalculator'
import { BatteryCalculator } from '../features/calculators/BatteryCalculator'
import { InverterCalculator } from '../features/calculators/InverterCalculator'
import { CableCalculator } from '../features/calculators/CableCalculator'
import { CostCalculator } from '../features/calculators/CostCalculator'

const tabs = [
  { id: 'load', label: 'Load' },
  { id: 'panel', label: 'Panel', premium: true },
  { id: 'battery', label: 'Battery', premium: true },
  { id: 'inverter', label: 'Inverter', premium: true },
  { id: 'cable', label: 'Cable', premium: true },
  { id: 'cost', label: 'Cost/kWh', premium: true },
]

export function CalculatorsPage() {
  const [tab, setTab] = useState('load')
  const { premiumUnlocked } = usePremiumAccess()
  const visibleTabs = tabs.map((item) => ({
    ...item,
    label: item.premium && !premiumUnlocked ? `${item.label} Pro` : item.label,
  }))

  return (
    <div>
      <Tabs tabs={visibleTabs} active={tab} onChange={setTab} />
      {tab === 'load' && <LoadCalculator />}
      {tab === 'panel' && <PremiumGate title="Unlock Panel Sizing"><PanelCalculator /></PremiumGate>}
      {tab === 'battery' && <PremiumGate title="Unlock Battery Sizing"><BatteryCalculator /></PremiumGate>}
      {tab === 'inverter' && <PremiumGate title="Unlock Inverter Sizing"><InverterCalculator /></PremiumGate>}
      {tab === 'cable' && <PremiumGate title="Unlock Cable & Breaker Sizing"><CableCalculator /></PremiumGate>}
      {tab === 'cost' && <PremiumGate title="Unlock Cost Tools"><CostCalculator /></PremiumGate>}
    </div>
  )
}
