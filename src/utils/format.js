export function formatNumber(value, digits = 0) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0'
  return number.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

export function formatCurrency(value, currency = '$') {
  const label = String(currency || '$').trim()
  return `${label} ${formatNumber(value)}`
}

export function clampNumber(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, number))
}
