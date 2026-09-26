import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tabs } from '../components/ui/Tabs'
import { PremiumGate } from '../components/auth/PremiumGate'
import { LoadCalculator } from '../features/calculators/LoadCalculator'
import { PanelCalculator } from '../features/calculators/PanelCalculator'
import { BatteryCalculator } from '../features/calculators/BatteryCalculator'
import { InverterCalculator } from '../features/calculators/InverterCalculator'
import { CableCalculator } from '../features/calculators/CableCalculator'
import { CostCalculator } from '../features/calculators/CostCalculator'
import { initialRows } from '../features/calculators/LoadCalculator'
import { usePersistentState } from '../hooks/usePersistentState'
import { calculateLoad } from '../utils/solarFormulas'
import { useSubscription } from '../contexts/SubscriptionContext'

const tabs = [
  { id: 'load', label: 'Load' },
  { id: 'panel', label: 'Panel' },
  { id: 'battery', label: 'Battery', premium: true, featureCode: 'battery_sizing' },
  { id: 'inverter', label: 'Inverter', premium: true, featureCode: 'inverter_sizing' },
  { id: 'cable', label: 'Cable', premium: true, featureCode: 'panel_configuration' },
  { id: 'cost', label: 'Cost/kWh', premium: true, featureCode: 'advanced_reports' },
]

export function CalculatorsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const initialTab = tabs.some((item) => item.id === requestedTab) ? requestedTab : 'load'
  const [tab, setTab] = useState(initialTab)
  const [rows, setRows] = usePersistentState('mse-load-rows', initialRows)
  const loadResult = calculateLoad(rows)
  const { isPremium } = useSubscription()
  const visibleTabs = tabs.map((item) => ({
    ...item,
    label: item.premium && !isPremium ? `${item.label} Pro` : item.label,
  }))

  useEffect(() => {
    if (tabs.some((item) => item.id === requestedTab)) {
      setTab(requestedTab)
    }
  }, [requestedTab])

  function selectTab(nextTab) {
    setTab(nextTab)
    setSearchParams({ tab: nextTab })
  }

  return (
    <div>
      <Tabs tabs={visibleTabs} active={tab} onChange={selectTab} />
      {tab === 'load' && <LoadCalculator rows={rows} setRows={setRows} result={loadResult} />}
      {tab === 'panel' && <PanelCalculator designLoad={loadResult.design} />}
      {tab === 'battery' && <PremiumGate featureCode="battery_sizing" title="Unlock Battery Sizing"><BatteryCalculator nightLoad={loadResult.nightDesign} /></PremiumGate>}
      {tab === 'inverter' && <PremiumGate featureCode="inverter_sizing" title="Unlock Inverter Sizing"><InverterCalculator sourceLoads={rows} /></PremiumGate>}
      {tab === 'cable' && <PremiumGate featureCode="panel_configuration" title="Unlock Cable Sizing"><CableCalculator /></PremiumGate>}
      {tab === 'cost' && <PremiumGate featureCode="advanced_reports" title="Unlock Cost Tools"><CostCalculator /></PremiumGate>}
    </div>
  )
}
