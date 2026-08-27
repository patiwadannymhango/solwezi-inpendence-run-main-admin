export function formatMoney(amount: string | number, currency: string): string {
  const value = typeof amount === 'string' ? Number.parseFloat(amount) : amount
  if (Number.isNaN(value)) return `${amount} ${currency}`
  return new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: currency || 'ZMW',
    currencyDisplay: 'code',
  }).format(value)
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(iso))
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')
}
