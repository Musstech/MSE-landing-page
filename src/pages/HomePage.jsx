import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, BatteryCharging, BookOpen, Cable, Calculator, CheckCircle2, Compass, FileText, Home, Search, SunMedium, Zap } from 'lucide-react'
import { books } from '../data/books'

const heroMessages = [
  { eyebrow: 'Professional solar workspace', lead: 'Design', tail: 'with clarity.', text: 'Plan and size practical solar systems from the loads that matter.', action: 'Explore solar tools', to: '/calculators?tab=load' },
  { eyebrow: 'Professional solar workspace', lead: 'Diagnose', tail: 'with structure.', text: 'Find faults faster with practical field checks and technical references.', action: 'Open diagnosis', to: '/troubleshooting' },
  { eyebrow: 'Professional solar workspace', lead: 'Quote', tail: 'professionally.', text: 'Prepare client-ready project documents from your completed design.', action: 'Create quotation', to: '/quotation' },
  { eyebrow: 'Learn in the field', lead: 'Keep learning', tail: 'with confidence.', text: 'Strengthen practical solar knowledge with timed questions, clear corrections, and field-ready technical guidance.', action: 'Take the solar quiz', to: '/quiz' },
]

const pathways = [
  { title: 'Professional solar guides', text: 'Practical books for designing, wiring, configuring, and troubleshooting.', to: '/books', action: 'Explore books', icon: BookOpen },
  { title: 'Professional calculations', text: 'Move from real appliance loads to panel, battery, inverter, and cable decisions.', to: '/calculators?tab=load', action: 'Open design tools', icon: Calculator },
  { title: 'Professional quotation', text: 'Prepare a clean project document from the solar system you have designed.', to: '/quotation', action: 'Create quotation', icon: FileText },
]

const capabilities = [
  { title: 'Design', text: 'Size the key components of a solar system from appliance loads.', to: '/calculators?tab=load', icon: SunMedium },
  { title: 'Diagnose', text: 'Follow clear field checks for common installation issues.', to: '/troubleshooting', icon: Search },
  { title: 'Configure', text: 'Review panels, batteries, inverter capacity, and MPPT choices.', to: '/calculators?tab=mppt', icon: Activity },
  { title: 'Quote', text: 'Build a client document that reflects the installer’s own business.', to: '/quotation', icon: FileText },
  { title: 'Navigator', text: 'Use a phone compass to check a panel-facing direction.', to: '/navigator', icon: Compass },
]

const tools = [
  { title: 'Solar sizing', text: 'PV panel sizing', to: '/calculators?tab=panel', icon: SunMedium },
  { title: 'Battery sizing', text: 'Night load bank', to: '/calculators?tab=battery', icon: BatteryCharging },
  { title: 'Inverter sizing', text: 'Running and surge load', to: '/calculators?tab=inverter', icon: Activity },
  { title: 'Cable sizing', text: 'Cable and voltage drop', to: '/calculators?tab=cable', icon: Cable },
]

function SolarSystemVisual() {
  return (
    <div className="hero-system" aria-label="Solar energy flows from the sun through panels and an inverter to battery storage and a home">
      <div className="energy-line energy-line-top" />
      <div className="energy-line energy-line-bottom" />
      <div className="system-sun"><SunMedium className="h-7 w-7" /></div>
      <div className="system-panel" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /></div>
      <div className="system-inverter"><Zap className="h-6 w-6" /><span>Inverter</span></div>
      <div className="system-battery"><BatteryCharging className="h-6 w-6" /><span>Battery</span></div>
      <div className="system-home"><Home className="h-7 w-7" /><span>Home load</span></div>
      <div className="system-caption"><CheckCircle2 className="h-4 w-4" /> Design decisions, connected.</div>
    </div>
  )
}

export function HomePage() {
  const [activeHero, setActiveHero] = useState(0)
  const message = heroMessages[activeHero]
  const featuredBooks = books.slice(0, 3)

  useEffect(() => {
    const timer = window.setInterval(() => setActiveHero((current) => (current + 1) % heroMessages.length), 3000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <div key={message.lead} className="hero-copy-transition">
            <p className="eyebrow">{message.eyebrow}</p>
            <h1><span>{message.lead}.</span> {message.tail}</h1>
            <p className="home-hero-description">{message.text}</p>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link className="primary-cta" to={message.to}>{message.action}<ArrowRight className="h-4 w-4" /></Link>
            <Link className="text-link" to="/books">Browse technical books <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="hero-indicators" aria-label="Solar Hub capabilities">
            {heroMessages.map((item, index) => <button key={item.lead} className={index === activeHero ? 'hero-indicator-active' : ''} onClick={() => setActiveHero(index)} aria-label={`Show ${item.lead} message`} />)}
          </div>
        </div>
        <SolarSystemVisual />
      </section>

      <section className="home-section pathway-section" aria-label="Solar Hub services">
        {pathways.map((item) => {
          const Icon = item.icon
          return <Link className="pathway-card" key={item.title} to={item.to}>
            <span className="pathway-icon"><Icon className="h-5 w-5" /></span>
            <span className="min-w-0"><span className="block font-heading text-base font-extrabold text-slate-950 dark:text-white">{item.title}</span><span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-slate-400">{item.text}</span><span className="pathway-action">{item.action}<ArrowRight className="h-4 w-4" /></span></span>
          </Link>
        })}
      </section>

      <section className="home-section section-split">
        <div className="section-intro">
          <p className="eyebrow">Core capabilities</p>
          <h2>One calm place for the work around a solar system.</h2>
          <p>Start where the project needs you, then move naturally into calculations, field checks, technical references, or a client quotation.</p>
        </div>
        <div className="capability-list">
          {capabilities.map((item) => {
            const Icon = item.icon
            return <Link className="capability-row" key={item.title} to={item.to}><span className="capability-icon"><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block font-heading font-extrabold text-slate-950 dark:text-white">{item.title}</span><span className="mt-0.5 block text-sm leading-5 text-slate-500 dark:text-slate-400">{item.text}</span></span><ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600" /></Link>
          })}
        </div>
      </section>

      <section className="home-section books-section">
        <div className="section-heading-row"><div><p className="eyebrow">Technical library</p><h2>Keep proven guidance close by.</h2></div><Link className="text-link" to="/books">View all books <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="featured-book-grid">
          {featuredBooks.map((book) => <Link className="featured-book" key={book.id} to="/books"><img src={book.cover} alt={`${book.title} cover`} loading="lazy" /><div className="p-4"><h3>{book.title}</h3><p>{book.subtitle}</p></div></Link>)}
        </div>
      </section>

      <section className="home-section workflow-section">
        <div className="section-heading-row"><div><p className="eyebrow">A practical workflow</p><h2>From load data to a complete solar system.</h2></div></div>
        <div className="workflow-grid">
          {[['01', 'Analyse', 'Enter appliance loads and the project needs.'], ['02', 'Calculate', 'Review component sizing and technical checks.'], ['03', 'Configure', 'Compare the equipment decisions for the system.'], ['04', 'Deliver', 'Prepare a polished quotation for the client.']].map(([number, title, text]) => <div key={number} className="workflow-step"><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </section>

      <section className="home-section tools-section">
        <div className="section-heading-row"><div><p className="eyebrow">Solar tools</p><h2>Make the core sizing decisions quickly.</h2></div><Link className="text-link hidden sm:inline-flex" to="/calculators?tab=load">Open all calculations <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="tool-grid">
          {tools.map((tool) => { const Icon = tool.icon; return <Link className="tool-card" key={tool.title} to={tool.to}><Icon className="h-5 w-5 text-sky-600 dark:text-sky-300" /><span><span className="block font-heading text-sm font-extrabold text-slate-950 dark:text-white">{tool.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{tool.text}</span></span><ArrowRight className="ml-auto h-4 w-4 text-slate-300 dark:text-slate-600" /></Link> })}
        </div>
      </section>

      <section className="home-section quiz-prompt">
        <div><p className="eyebrow">Keep learning</p><h2>Test practical solar knowledge as you build.</h2><p>Work through a timed quiz across basic, intermediate, and advanced solar topics.</p></div>
        <Link className="secondary-cta" to="/quiz">Open solar quiz <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <section className="home-final-cta">
        <p className="eyebrow">Ready when the project is</p>
        <h2>Bring the next solar system into focus.</h2>
        <Link className="primary-cta" to="/calculators?tab=load">Start a design <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </div>
  )
}
