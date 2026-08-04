import { maintenanceSchedules } from '../../data/troubleshooting'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'

const tones = {
  blue: 'bg-[#2C5282]',
  orange: 'bg-solar',
  green: 'bg-sgreen',
}

export function MaintenanceChecklist() {
  return (
    <div>
      <SectionHeader title="Maintenance Checklist" subtitle="Preventive inspection schedule for installed systems." />
      <div className="grid gap-4 lg:grid-cols-3">
        {maintenanceSchedules.map((schedule) => (
          <Card key={schedule.period} className="p-0">
            <div className={`rounded-t-lg px-4 py-3 font-heading text-lg font-extrabold text-white ${tones[schedule.tone]}`}>
              {schedule.period}
            </div>
            <div className="divide-y divide-slate-100">
              {schedule.tasks.map((task) => (
                <label key={task} className="flex gap-3 p-4 text-sm leading-6 text-slate-600">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-navy" />
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

