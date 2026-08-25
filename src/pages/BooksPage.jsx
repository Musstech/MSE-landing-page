import { ExternalLink } from 'lucide-react'
import { books } from '../data/books'
import { formatCurrency } from '../utils/format'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

const tones = {
  navy: 'from-navy to-[#243f63]',
  blue: 'from-[#2C5282] to-[#396ca4]',
  orange: 'from-solar to-[#f08a45]',
  green: 'from-sgreen to-[#31845c]',
}

export function BooksPage() {
  return (
    <div>
      <SectionHeader title="MSE Ebook Store" subtitle="Professional solar training books by Imam Musa, Musstech Solar Energy." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden p-0">
            <div className={`min-h-44 bg-gradient-to-br p-5 text-white ${tones[book.tone]}`}>
              <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-extrabold text-navy">{book.badge}</span>
              <div className="mt-10 text-xs text-white/65">{book.chapters} chapters | {book.pages} pages</div>
              <div className="mt-1 font-heading text-xl font-extrabold leading-tight">{book.title}</div>
              <div className="mt-1 text-sm text-white/75">{book.subtitle}</div>
            </div>
            <div className="p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {book.topics.slice(0, 4).map((topic) => <span key={topic} className="rounded-full bg-[#EEF2F7] px-2 py-1 text-[10px] font-bold text-navy">{topic}</span>)}
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-heading text-xl font-extrabold text-gold">{formatCurrency(book.price)}</div>
                <a className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#243f63]" href="https://selar.com/m/M_S_E" target="_blank" rel="noreferrer">
                  Buy <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <section className="mt-6 rounded-lg bg-gradient-to-br from-navy to-[#2C5282] p-6 text-center text-white">
        <div className="text-xs font-bold uppercase tracking-wide text-gold">Get all 4 books</div>
        <div className="mt-1 font-heading text-2xl font-extrabold">The Complete MSE Solar Library</div>
        <a className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-gold px-6 text-sm font-extrabold text-navy" href="https://selar.com/m/M_S_E" target="_blank" rel="noreferrer">Visit Selar Store</a>
      </section>
    </div>
  )
}
