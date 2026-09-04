import { Printer } from 'lucide-react'
import { calculateQuote } from '../../utils/solarFormulas'
import { formatCurrency, formatNumber } from '../../utils/format'
import { getCurrencyOption, getCurrencySymbol } from '../../data/currencies'
import { Button } from '../../components/ui/Button'

export function QuotePreview({ client, installer, system, extras, margin, reference }) {
  const quote = calculateQuote(system, extras, margin)
  const currencyOption = getCurrencyOption(installer.currencyCode || installer.currency)
  const currency = getCurrencySymbol(currencyOption.code)
  const companyName = installer.companyName || 'Your Company'
  const companySubtitle = installer.subtitle ?? installer.tagline ?? ''
  const rows = [
    [`Solar Panel ${system.panelW}W`, quote.panels, system.panelPrice, quote.panels * system.panelPrice],
    [`${system.battType === 'lithium' ? 'Lithium Battery' : 'Battery'} ${system.battAh}Ah ${system.voltage}V`, quote.batteries, system.battPrice, quote.batteries * system.battPrice],
    [`Hybrid Inverter ${formatNumber(quote.inverterWatts / 1000, 1)}kVA`, 1, system.invPrice, system.invPrice],
    ['Cables, breakers, accessories and installation', 1, extras, extras],
  ]

  return (
    <section className="quote-print overflow-hidden rounded-[28px] border border-slate-200 bg-white text-slate-800 shadow-2xl dark:border-slate-800">
      <div className="bg-gradient-to-br from-slate-950 to-sky-700 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Solar Quotation</div>
            <div className="mt-2 font-heading text-3xl font-extrabold tracking-normal">{companyName}</div>
            {companySubtitle ? <div className="mt-1 text-sm text-white/70">{companySubtitle}</div> : null}
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/80 backdrop-blur sm:text-right">
            <div>Date: {client.date}</div>
            <div>Ref: {reference}</div>
            <div>{currencyOption.code} {currencyOption.symbol}</div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Prepared for</div>
            <div className="font-bold text-slate-950">{client.name || 'Client name'}</div>
            <div className="text-sm text-slate-500">{client.address || 'Site address'}</div>
            <div className="text-sm text-slate-500">{client.phone} {client.email}</div>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-sky-700">System Summary</div>
            <div className="grid gap-1 text-sm text-slate-700">
              <div>{quote.panels} x {system.panelW}W panels</div>
              <div>{quote.batteries} x {system.battAh}Ah batteries</div>
              <div>{formatNumber(quote.inverterWatts / 1000, 1)}kVA inverter</div>
              <div>{formatNumber(system.psh || 5, 1)} peak sun hours</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
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
              <tr className="bg-sky-500 text-white">
                <td className="p-4 font-heading font-extrabold" colSpan="3">TOTAL INVESTMENT</td>
                <td className="p-4 text-right font-heading text-lg font-extrabold">{formatCurrency(quote.totalCost, currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <div className="font-bold text-slate-950">Terms & Validity</div>
          <div>This quotation is valid for 14 days from the date above.</div>
          <div>Prices are subject to component and installation changes.</div>
          <div>Deposit and warranty terms should be confirmed by the installer.</div>
        </div>
      </div>
      <Button className="print:hidden w-full rounded-none" variant="sky" onClick={() => window.print()}>
        <Printer className="h-4 w-4" />
        Print / Save as PDF
      </Button>
    </section>
  )
}
