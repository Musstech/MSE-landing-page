import { Link } from 'react-router-dom'
import { Calculator, FileText, Search, BookOpen } from 'lucide-react'
import { Card } from '../components/ui/Card'

const actions = [
  { title: 'Solar Calculators', desc: 'Load, panel, battery, inverter, cable, breaker, and cost sizing.', to: '/calculators', icon: Calculator, tone: 'text-gold' },
  { title: 'Troubleshooting', desc: 'Fault wizard, inverter error codes, and maintenance schedules.', to: '/troubleshooting', icon: Search, tone: 'text-solar' },
  { title: 'Quotation Generator', desc: 'Auto-size a system and prepare a professional client quote.', to: '/quotation', icon: FileText, tone: 'text-sgreen' },
  { title: 'Ebook Store', desc: 'Training books for solar installers and consultants.', to: '/books', icon: BookOpen, tone: 'text-[#2C5282]' },
]

export function HomePage() {
  return (
    <div>
      <section className="mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-navy to-[#2C5282] p-6 text-white sm:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Musstech Solar Energy</div>
        <h2 className="mt-2 font-heading text-4xl font-extrabold tracking-normal">Solar Hub</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Professional solar calculators, diagnosis tools, training resources, and quotation workflow for real installation work.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="inline-flex min-h-11 items-center rounded-lg bg-gold px-5 text-sm font-extrabold text-navy" to="/calculators">Start Calculating</Link>
          <Link className="inline-flex min-h-11 items-center rounded-lg bg-white/15 px-5 text-sm font-bold text-white" to="/quotation">Create Quote</Link>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.to} to={action.to}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
                <Icon className={`h-8 w-8 ${action.tone}`} />
                <div className="mt-4 font-heading text-lg font-extrabold text-navy">{action.title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-500">{action.desc}</p>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

