import { useState } from 'react'
import { Check, ChevronLeft } from 'lucide-react'
import { symptoms } from '../../data/troubleshooting'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'

export function FaultWizard() {
  const [symptom, setSymptom] = useState(null)
  const [step, setStep] = useState(0)

  if (!symptom) {
    return (
      <div>
        <SectionHeader title="What symptom are you seeing?" subtitle="Choose the closest match and walk through a systematic diagnosis." />
        <div className="grid gap-3">
          {symptoms.map((item) => (
            <button key={item.id} className="diagnosis-choice p-4 text-left text-sm font-semibold" onClick={() => { setSymptom(item); setStep(0) }}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => { setSymptom(null); setStep(0) }}><ChevronLeft className="h-4 w-4" />Symptoms</Button>
      <section className="diagnosis-hero mb-5 p-5">
        <div className="text-xs font-semibold text-sky-700 dark:text-sky-300">Diagnosing</div>
        <div className="mt-1 font-heading text-xl font-extrabold">{symptom.label}</div>
      </section>
      <div className="space-y-3">
        {symptom.steps.map((item, index) => (
          <Card key={item} className={`diagnosis-step ${index < step ? 'diagnosis-step-complete' : index === step ? 'diagnosis-step-current' : 'diagnosis-step-idle'}`}>
            <div className="flex gap-3">
              <div className={`diagnosis-step-number flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${index < step ? 'diagnosis-step-number-complete' : index === step ? 'diagnosis-step-number-current' : 'diagnosis-step-number-idle'}`}>
                {index < step ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm leading-6 text-navy">{item}</div>
                {index === step ? <Button className="mt-3" variant="gold" size="sm" onClick={() => setStep((current) => current + 1)}>{step === symptom.steps.length - 1 ? 'Mark resolved' : 'Check done'}</Button> : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {step >= symptom.steps.length ? (
        <Card className="diagnosis-complete mt-4 text-center">
          <div className="font-heading text-lg font-extrabold text-slate-950 dark:text-white">Diagnostic steps completed</div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">If the issue persists, check the fault code reference or contact the manufacturer service centre.</p>
          <Button className="mt-4" variant="primary" onClick={() => { setSymptom(null); setStep(0) }}>Start new diagnosis</Button>
        </Card>
      ) : null}
    </div>
  )
}
