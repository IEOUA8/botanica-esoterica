import { describe, it, expect } from 'vitest'
import { formatCurrency, encodeWhatsapp } from '../utils/format'

describe('formatCurrency', () => {
  it('formats a positive integer as COP', () => {
    const result = formatCurrency(89000)
    expect(result).toContain('89')
    expect(result).toContain('000')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toBeTruthy()
    expect(result).toContain('0')
  })

  it('formats null/undefined as 0', () => {
    expect(formatCurrency(null)).toBeTruthy()
    expect(formatCurrency(undefined)).toBeTruthy()
  })

  it('formats large numbers', () => {
    const result = formatCurrency(1000000)
    expect(result).toContain('1')
    expect(result).toContain('000')
  })
})

describe('encodeWhatsapp', () => {
  it('builds a wa.me URL with the given number', () => {
    const url = encodeWhatsapp('573001234567', 'Hola')
    expect(url).toContain('wa.me/573001234567')
  })

  it('URL-encodes the message', () => {
    const url = encodeWhatsapp('57300', 'Hola mundo')
    expect(url).toContain(encodeURIComponent('Hola mundo'))
  })

  it('handles messages with special characters', () => {
    const message = 'Pedido #BEI-20260620-A1B2C: $89.000'
    const url = encodeWhatsapp('57300', message)
    expect(url).toContain('wa.me/57300')
    expect(url).not.toContain(' ')
  })
})
