import { ExternalLink } from 'lucide-react'
import { books } from '../data/books'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

export function BooksPage() {
  return (
    <div>
      <SectionHeader title="Ebooks" subtitle="Practical solar training books for installers, consultants, and learners." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {books.map((book) => (
          <Card key={book.id} className="book-catalog-card overflow-hidden p-0">
            <div className="book-cover-stage p-3">
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="mx-auto aspect-[3/4] max-h-80 w-full rounded-xl object-contain shadow-lg"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <div className="font-heading text-lg font-extrabold leading-tight text-slate-950 dark:text-white">{book.title}</div>
              <div className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{book.subtitle}</div>
              <a
                className="book-action mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 px-4 text-sm font-semibold"
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
