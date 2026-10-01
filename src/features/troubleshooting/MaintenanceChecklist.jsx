import { maintenanceSchedules } from '../../data/troubleshooting'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'

export function MaintenanceChecklist() {
  return (
    <div>
      <SectionHeader title="Maintenance Checklist" subtitle="Preventive inspection schedule for installed systems." />
      <div className="grid gap-4 lg:grid-cols-3">
        {maintenanceSchedules.map((schedule) => (
          <Card key={schedule.period} className="checklist-card p-0">
            <div className="checklist-header px-4 py-3 font-heading text-lg font-extrabold text-slate-950 dark:text-white">
              {schedule.period}
            </div>
            <div className="divide-y divide-slate-100">
              {schedule.tasks.map((task) => (
                <label key={task} className="flex gap-3 p-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <input type="checkbox" className="app-checkbox mt-1 h-4 w-4" />
                  {task}
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
