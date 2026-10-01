import { Printer } from 'lucide-react'
import { calculateQuote } from '../../utils/solarFormulas'
import { formatCurrency, formatNumber } from '../../utils/format'
import { getCurrencyOption, getCurrencySymbol } from '../../data/currencies'
import { Button } from '../../components/ui/Button'

export function QuotePreview({ client, installer, system, extras, margin, reference, commercial, loads, mode = 'basic', advanced = {} }) {
  const quote = calculateQuote(system, extras, margin, { loads })
  const currencyOption = getCurrencyOption(installer.currencyCode || installer.currency)
  const currency = getCurrencySymbol(currencyOption.code)
  const companyName = installer.companyName || 'Your Company'
  const companySubtitle = installer.subtitle ?? installer.tagline ?? ''
  const taxEnabled = commercial?.taxEnabled
  const taxAmount = taxEnabled ? quote.totalCost * (Math.max(0, Number(commercial.taxPercent) || 0) / 100) : 0
  const finalTotal = quote.totalCost + taxAmount
  const rows = [
    [`Solar Panel ${system.panelW}W`, quote.panels, system.panelPrice, quote.panels * system.panelPrice],
    [`${system.battType === 'lithium' ? 'Lithium Battery' : 'Battery'} ${system.battAh}Ah ${system.voltage}V`, quote.batteries, system.battPrice, quote.batteries * system.battPrice],
    [`Hybrid Inverter ${formatNumber(quote.inverterWatts / 1000, 1)}kVA`, 1, system.invPrice, system.invPrice],
    ['Cables, breakers, accessories and installation', 1, extras, extras],
  ]

  return (
    <section className="quote-print quote-document overflow-hidden bg-white text-slate-800 dark:border-slate-800">
      <div className="quote-letterhead p-6 text-white sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Solar Quotation</div>
            <div className="mt-2 font-heading text-3xl font-extrabold tracking-normal">{companyName}</div>
            {companySubtitle ? <div className="mt-1 text-sm text-white/70">{companySubtitle}</div> : null}
          </div>
          <div className="quote-reference p-4 text-sm text-white/80 sm:text-right">
            <div>Date: {client.date}</div>
            <div>Ref: {reference || 'Not provided'}</div>
            <div>{currencyOption.code} {currencyOption.symbol}</div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="quote-info-card p-4">
            <div className="mb-2 text-xs font-semibold text-slate-500">Prepared for</div>
            <div className="font-bold text-slate-950">{client.name || 'Client name'}</div>
            {client.projectName ? <div className="mt-1 text-sm font-semibold text-slate-700">{client.projectName}</div> : null}
            <div className="text-sm text-slate-500">{client.address || 'Site address'}</div>
            <div className="text-sm text-slate-500">{client.phone} {client.email}</div>
          </div>
          <div className="quote-info-card quote-system-summary p-4">
            <div className="mb-2 text-xs font-semibold text-sky-700">System Summary</div>
            <div className="grid gap-1 text-sm text-slate-700">
              <div>{quote.panels} x {system.panelW}W panels</div>
              <div>{quote.batteries} x {system.battAh}Ah batteries</div>
              <div>{formatNumber(quote.inverterWatts / 1000, 1)}kVA inverter</div>
              <div>{formatNumber(quote.designLoad)}Wh/day design load</div>
              <div>{formatNumber(system.psh || 5, 1)} peak sun hours</div>
            </div>
          </div>
        </div>

        <div className="quote-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([desc, qty, unit, total]) => (
                <tr key={desc} className="border-t border-slate-100 odd:bg-slate-50">
                  <td className="p-3 text-slate-800">{desc}</td>
                  <td className="p-3 text-right">{qty}</td>
                  <td className="p-3 text-right">{formatCurrency(unit, currency)}</td>
                  <td className="p-3 text-right font-semibold">{formatCurrency(total, currency)}</td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 bg-slate-50">
                <td className="p-3 font-bold text-slate-950" colSpan="3">Subtotal</td>
                <td className="p-3 text-right font-bold text-slate-950">{formatCurrency(quote.equipCost, currency)}</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="p-3 font-bold text-slate-950" colSpan="3">After Margin</td>
                <td className="p-3 text-right font-bold text-slate-950">{formatCurrency(quote.totalCost, currency)}</td>
              </tr>
              {taxEnabled ? (
                <tr className="border-t border-slate-200">
                  <td className="p-3 font-bold text-slate-950" colSpan="3">Tax / VAT ({formatNumber(commercial.taxPercent)}%)</td>
                  <td className="p-3 text-right font-bold text-slate-950">{formatCurrency(taxAmount, currency)}</td>
                </tr>
              ) : null}
              <tr className="bg-slate-950 text-white">
                <td className="p-4 font-heading font-extrabold" colSpan="3">TOTAL INVESTMENT</td>
                <td className="p-4 text-right font-heading text-lg font-extrabold">{formatCurrency(finalTotal, currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {mode === 'advanced' ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="quote-info-card p-4">
              <div className="text-xs font-semibold text-slate-500">Technical Specification</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <div><span className="font-semibold">System:</span> {advanced.systemType || 'Hybrid solar system'}</div>
                <div><span className="font-semibold">PV array:</span> {quote.panels} x {system.panelW}W {advanced.panelModel || 'panels'}</div>
                <div><span className="font-semibold">Battery:</span> {quote.batteries} x {system.battAh}Ah {advanced.batteryModel || 'battery bank'}</div>
                <div><span className="font-semibold">Inverter:</span> {formatNumber(quote.inverterWatts / 1000, 1)}kVA {advanced.inverterModel || 'hybrid inverter'}</div>
                {advanced.cableNotes ? <div><span className="font-semibold">Cabling:</span> {advanced.cableNotes}</div> : null}
                {advanced.protectionNotes ? <div><span className="font-semibold">Protection:</span> {advanced.protectionNotes}</div> : null}
              </div>
            </div>
            <div className="quote-info-card p-4">
              <div className="text-xs font-semibold text-slate-500">Installation Scope</div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{advanced.installationScope || 'Scope to be confirmed by the installer before procurement and installation.'}</p>
            </div>
          </div>
        ) : null}

        <div className="quote-terms mt-5 p-4 text-sm leading-6 text-slate-600">
          <div className="font-bold text-slate-950">Terms & Validity</div>
          <div>This quotation is valid for {commercial?.validityDays || 14} days from the date above.</div>
          <div>{commercial?.paymentTerms || 'Payment schedule to be agreed before procurement begins.'}</div>
          <div>{commercial?.warranty || 'Product warranty follows the manufacturer warranty. Workmanship warranty should be stated by the installer.'}</div>
          {commercial?.bankDetails ? <div className="mt-2 whitespace-pre-line"><span className="font-bold text-slate-950">Bank details:</span> {commercial.bankDetails}</div> : null}
        </div>
      </div>
      <Button className="print:hidden w-full rounded-none" variant="sky" onClick={() => window.print()}>
        <Printer className="h-4 w-4" />
        Print / Save as PDF
      </Button>
    </section>
  )
}
