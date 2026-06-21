export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function encodeWhatsapp(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
