import { useState } from 'react'
import { Tabs } from '../components/ui/Tabs'
import { FaultWizard } from '../features/troubleshooting/FaultWizard'
import { FaultCodeSearch } from '../features/troubleshooting/FaultCodeSearch'
import { MaintenanceChecklist } from '../features/troubleshooting/MaintenanceChecklist'

const tabs = [
  { id: 'wizard', label: 'Fault Wizard' },
  { id: 'codes', label: 'Fault Codes' },
  { id: 'maintenance', label: 'Maintenance' },
]

export function TroubleshootingPage() {
  const [tab, setTab] = useState('wizard')
  return (
    <div>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'wizard' && <FaultWizard />}
      {tab === 'codes' && <FaultCodeSearch />}
      {tab === 'maintenance' && <MaintenanceChecklist />}
    </div>
  )
}

