export function Field({ label, hint, children }) {
  return (
    <label className="field-label block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  )
}

export function numericInputValue(value) {
  return value === '' ? '' : Number(value)
}

export function NumberInput({ label, value, onChange, unit, min = 0, max, step = 1, hint }) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <input
          className="input technical-input pr-12"
          type="number"
          value={value ?? ''}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(numericInputValue(event.target.value))}
        />
        {unit ? <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">{unit}</span> : null}
      </div>
    </Field>
  )
}

export function TextInput({ label, value, onChange, type = 'text', hint }) {
  return (
    <Field label={label} hint={hint}>
      <input className={`input ${type === 'number' ? 'technical-input' : ''}`} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  )
}

export function SelectInput({ label, value, onChange, options, hint }) {
  return (
    <Field label={label} hint={hint}>
      <select className="input select-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </Field>
  )
}
