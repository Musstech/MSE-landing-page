import { Printer } from 'lucide-react'
import { calculateQuote } from '../../utils/solarFormulas'
import { formatCurrency, formatNumber } from '../../utils/format'
import { Button } from '../../components/ui/Button'

export function QuotePreview({ client, system, extras, margin, reference }) {
  const quote = calculateQuote(system, extras, margin)
  const rows = [
    [`Solar Panel ${system.panelW}W Monocrystalline`, quote.panels, system.panelPrice, quote.panels * system.panelPrice],
    [`${system.battType === 'lithium' ? 'Lithium LiFePO4' : 'Battery'} ${system.battAh}Ah ${system.voltage}V`, quote.batteries, system.battPrice, quote.batteries * system.battPrice],
    [`Hybrid Inverter ${formatNumber(quote.inverterWatts / 1000, 1)}kVA`, 1, system.invPrice, system.invPrice],
    ['Cables, breakers, accessories and installation', 1, extras, extras],
  ]

  return (
    <section className="quote-print overflow-hidden rounded-lg border-2 border-navy bg-white">
      <div className="flex flex-col gap-4 bg-navy p-6 text-white sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-heading text-2xl font-extrabold text-gold">MUSSTECH SOLAR ENERGY</div>
          <div className="mt-1 text-sm text-white/70">Imam Musa | Solar Energy Consultant & Technical Trainer</div>
        </div>
        <div className="text-sm text-white/70 sm:text-right">
          <div className="font-bold text-gold">SOLAR QUOTATION</div>
          <div>Date: {client.date}</div>
          <div>Ref: {reference}</div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-gold to-solar" />
      <div className="p-5 sm:p-7">
        <div className="mb-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-navy">Prepared for</div>
          <div className="font-bold text-navy">{client.name || 'Client name'}</div>
          <div className="text-sm text-slate-500">{client.address || 'Site address'}</div>
          <div className="text-sm text-slate-500">{client.phone} {client.email}</div>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-[#EEF2F7] p-3"><div className="text-[10px] font-bold uppercase text-navy">Panels</div><div className="font-heading font-extrabold text-navy">{quote.panels} x {system.panelW}W</div></div>
          <div className="rounded-lg bg-[#EEF2F7] p-3"><div className="text-[10px] font-bold uppercase text-navy">Battery</div><div className="font-heading font-extrabold text-navy">{quote.batteries} x {system.battAh}Ah</div></div>
          <div className="rounded-lg bg-[#EEF2F7] p-3"><div className="text-[10px] font-bold uppercase text-navy">Inverter</div><div className="font-heading font-extrabold text-navy">{formatNumber(quote.inverterWatts / 1000, 1)}kVA</div></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([desc, qty, unit, total]) => (
                <tr key={desc} className="odd:bg-[#EEF2F7]">
                  <td className="p-3 text-navy">{desc}</td>
                  <td className="p-3 text-right">{qty}</td>
                  <td className="p-3 text-right">{formatCurrency(unit)}</td>
                  <td className="p-3 text-right font-semibold">{formatCurrency(total)}</td>
                </tr>
              ))}
              <tr className="bg-[#EEF2F7]">
                <td className="p-3 font-bold text-navy" colSpan="3">Subtotal</td>
                <td className="p-3 text-right font-bold text-navy">{formatCurrency(quote.equipCost)}</td>
              </tr>
              <tr className="bg-navy">
                <td className="p-4 font-heading font-extrabold text-gold" colSpan="3">TOTAL INVESTMENT</td>
                <td className="p-4 text-right font-heading text-lg font-extrabold text-gold">{formatCurrency(quote.totalCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-lg bg-[#EEF2F7] p-4 text-sm leading-6 text-slate-600">
          <div className="font-bold text-navy">Terms & Validity</div>
          <div>This quotation is valid for 14 days from the date above.</div>
          <div>Prices are in Nigerian Naira and subject to component price fluctuations.</div>
          <div>50% deposit required to confirm order. Balance on delivery and installation completion.</div>
          <div>Installation warranty: 12 months. Equipment warranty: as per manufacturer terms.</div>
        </div>
      </div>
      <Button className="print:hidden w-full rounded-none" variant="gold" onClick={() => window.print()}><Printer className="h-4 w-4" />Print / Save as PDF</Button>
    </section>
  )
}

