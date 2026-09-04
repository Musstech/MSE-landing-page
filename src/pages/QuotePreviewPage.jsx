import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PremiumGate } from '../components/auth/PremiumAccess'
import { usePersistentState } from '../hooks/usePersistentState'
import { Button } from '../components/ui/Button'
import { QuotePreview } from '../features/quotation/QuotePreview'

const today = new Date().toISOString().slice(0, 10)

export function QuotePreviewPage() {
  const [installer] = usePersistentState('mse-quote-installer', { companyName: '', subtitle: '', currencyCode: 'USD' })
  const [client] = usePersistentState('mse-quote-client', { name: '', address: '', phone: '', email: '', date: today })
  const [system] = usePersistentState('mse-quote-system', { designLoad: 8000, nightLoad: 4000, voltage: 48, battType: 'lithium', autonomy: 1, regionId: 'global-average', psh: 5, efficiency: 75, panelW: 500, battAh: 200, panelPrice: 145000, battPrice: 480000, invPrice: 520000 })
  const [margin] = usePersistentState('mse-quote-margin', 20)
  const [extras] = usePersistentState('mse-quote-extras', 150000)
  const [reference] = usePersistentState('mse-quote-reference', `QUOTE-${Date.now().toString().slice(-6)}`)

  return (
    <PremiumGate title="Unlock Professional Quotations">
      <div>
        <div className="print:hidden mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-slate-950 dark:text-white">Quotation Preview</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review the client document before printing or saving it as PDF.</p>
          </div>
          <Button as={Link} to="/quotation" variant="soft">
            <ArrowLeft className="h-4 w-4" />
            Back to Editor
          </Button>
        </div>
        <QuotePreview client={client} installer={installer} system={system} extras={extras} margin={margin} reference={reference} />
      </div>
    </PremiumGate>
  )
}
