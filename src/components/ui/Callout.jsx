import { AlertTriangle, Lightbulb } from 'lucide-react'

export function Callout({ children, tone = 'tip' }) {
  const isWarning = tone === 'warning'
  const Icon = isWarning ? AlertTriangle : Lightbulb
  return (
    <div className={`callout mt-4 flex gap-3 p-3.5 text-sm ${isWarning ? 'callout-warning' : 'callout-tip'}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
