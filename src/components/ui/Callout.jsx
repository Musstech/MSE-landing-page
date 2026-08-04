import { AlertTriangle, Lightbulb } from 'lucide-react'

export function Callout({ children, tone = 'tip' }) {
  const isWarning = tone === 'warning'
  const Icon = isWarning ? AlertTriangle : Lightbulb
  return (
    <div className={`mt-3 flex gap-3 rounded-lg border p-3 text-sm ${isWarning ? 'border-[#C53030] bg-[#FFF5F5] text-[#742A2A]' : 'border-sgreen bg-[#F0FFF4] text-[#1C4532]'}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}

