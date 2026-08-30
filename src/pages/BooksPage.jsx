import { ExternalLink } from 'lucide-react'
import { books } from '../data/books'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

const tones = {
  navy: 'from-slate-900 to-slate-700',
  blue: 'from-sky-500 to-blue-600',
  orange: 'from-orange-400 to-rose-500',
  green: 'from-emerald-500 to-sky-500',
  gold: 'from-amber-300 to-sky-400',
}

export function BooksPage() {
  return (
    <div>
      <SectionHeader title="Ebooks" subtitle="Practical solar training books for installers, consultants, and learners." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden p-0">
            <div className={`relative bg-gradient-to-br p-3 ${tones[book.tone] || tones.blue}`}>
              <span className="absolute right-4 top-4 z-10 rounded-full bg-white/85 px-3 py-1 text-[10px] font-extrabold text-slate-900 shadow-sm backdrop-blur">
                {book.badge}
              </span>
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="mx-auto aspect-[3/4] max-h-80 w-full rounded-2xl object-contain shadow-2xl"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <div className="font-heading text-lg font-extrabold leading-tight text-slate-950 dark:text-white">{book.title}</div>
              <div className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{book.subtitle}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {book.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                    {topic}
                  </span>
                ))}
              </div>
              <a
                className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-4 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600"
                href="https://selar.com/m/M_S_E"
                target="_blank"
                rel="noreferrer"
              >
                Buy <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

