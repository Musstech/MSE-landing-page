import clsx from 'clsx'

export function Button({ children, variant = 'primary', size = 'md', className, as: Component = 'button', ...props }) {
  return (
    <Component
      className={clsx(
        'button-base inline-flex min-h-11 items-center justify-center gap-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'button-primary',
        variant === 'gold' && 'button-warm',
        variant === 'sky' && 'button-primary',
        variant === 'soft' && 'button-soft',
        variant === 'ghost' && 'button-ghost',
        variant === 'danger' && 'button-danger',
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
