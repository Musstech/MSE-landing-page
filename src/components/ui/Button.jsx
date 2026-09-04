import clsx from 'clsx'

export function Button({ children, variant = 'primary', size = 'md', className, as: Component = 'button', ...props }) {
  return (
    <Component
      className={clsx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600',
        variant === 'gold' && 'bg-gold text-navy hover:bg-[#e29a20]',
        variant === 'sky' && 'bg-sky-500 text-white hover:bg-sky-600',
        variant === 'soft' && 'bg-[#EEF2F7] text-navy hover:bg-[#e2e8f0] dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        variant === 'ghost' && 'bg-transparent text-navy hover:bg-[#EEF2F7] dark:text-slate-100 dark:hover:bg-slate-800',
        variant === 'danger' && 'bg-[#FFF5F5] text-[#C53030] hover:bg-[#fed7d7]',
        size === 'sm' && 'px-3 py-2 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-5 py-3 text-base',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
