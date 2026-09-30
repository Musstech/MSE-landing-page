import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { searchIndex } from '../../data/searchIndex'

export function GlobalSearch({ open, onClose }) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return undefined
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(timeout)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose, open])

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return searchIndex.slice(0, 7)
    return searchIndex.filter((item) => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(normalizedQuery)).slice(0, 8)
  }, [query])

  function selectResult(result) {
    navigate(result.to)
    onClose()
  }

  function submitSearch(event) {
    event.preventDefault()
    if (results[0]) selectResult(results[0])
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-24" role="presentation">
      <button className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" aria-label="Close search" onClick={onClose} />
      <section className="search-dialog relative mx-auto w-full max-w-2xl" role="dialog" aria-modal="true" aria-label="Search Solar Hub">
        <form onSubmit={submitSearch} className="flex min-h-14 items-center gap-3 border-b border-slate-200/80 px-4 dark:border-white/10">
          <Search className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-300" />
          <input
            ref={inputRef}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools, guides, and workspace pages"
            aria-label="Search Solar Hub"
          />
          {query ? <button type="button" className="icon-button h-8 w-8" aria-label="Clear search" onClick={() => setQuery('')}><X className="h-4 w-4" /></button> : null}
          <button type="button" className="icon-button h-8 w-8" aria-label="Close search" onClick={onClose}><X className="h-4 w-4" /></button>
        </form>
        <div className="max-h-[min(65vh,34rem)] overflow-y-auto p-2">
          <div className="px-3 pb-2 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            {query ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Start here'}
          </div>
          {results.length ? results.map((result) => (
            <button key={result.id} className="group flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3 text-left transition hover:bg-sky-50 dark:hover:bg-white/10" onClick={() => selectResult(result)}>
              <span className="min-w-0">
                <span className="block font-heading text-sm font-bold text-slate-900 dark:text-white">{result.title}</span>
                <span className="mt-0.5 block truncate text-xs leading-5 text-slate-500 dark:text-slate-400">{result.description}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-sky-600 dark:text-slate-600 dark:group-hover:text-sky-300" />
            </button>
          )) : <div className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No workspace result matches that search.</div>}
        </div>
      </section>
    </div>
  )
}
