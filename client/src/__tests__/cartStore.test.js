import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useCartStore } from '../store/cartStore'

const product = (overrides = {}) => ({
  _id: 'prod-1',
  slug: 'kit-abundancia',
  name: 'Kit de Abundancia',
  price: 89000,
  mainImage: 'https://example.com/img.jpg',
  stock: 10,
  ...overrides,
})

function resetStore() {
  act(() => useCartStore.setState({ items: [] }))
}

describe('cartStore', () => {
  beforeEach(resetStore)

  describe('addItem', () => {
    it('adds a new product to the cart', () => {
      act(() => useCartStore.getState().addItem(product(), 1))
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].name).toBe('Kit de Abundancia')
      expect(items[0].quantity).toBe(1)
    })

    it('increases quantity for an existing product', () => {
      act(() => {
        useCartStore.getState().addItem(product(), 2)
        useCartStore.getState().addItem(product(), 3)
      })
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(5)
    })

    it('does not exceed product stock when adding', () => {
      const p = product({ stock: 3 })
      act(() => {
        useCartStore.getState().addItem(p, 2)
        useCartStore.getState().addItem(p, 5) // would exceed stock of 3
      })
      const { items } = useCartStore.getState()
      expect(items[0].quantity).toBe(3)
    })

    it('adds multiple different products', () => {
      act(() => {
        useCartStore.getState().addItem(product({ _id: 'p1', name: 'A' }), 1)
        useCartStore.getState().addItem(product({ _id: 'p2', name: 'B' }), 2)
      })
      expect(useCartStore.getState().items).toHaveLength(2)
    })
  })

  describe('updateQuantity', () => {
    it('updates quantity for an item', () => {
      act(() => useCartStore.getState().addItem(product(), 1))
      act(() => useCartStore.getState().updateQuantity('prod-1', 4))
      expect(useCartStore.getState().items[0].quantity).toBe(4)
    })

    it('enforces minimum quantity of 1', () => {
      act(() => useCartStore.getState().addItem(product(), 2))
      act(() => useCartStore.getState().updateQuantity('prod-1', 0))
      expect(useCartStore.getState().items[0].quantity).toBe(1)
    })
  })

  describe('removeItem', () => {
    it('removes an item from the cart', () => {
      act(() => useCartStore.getState().addItem(product(), 1))
      act(() => useCartStore.getState().removeItem('prod-1'))
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('removes only the targeted item', () => {
      act(() => {
        useCartStore.getState().addItem(product({ _id: 'p1' }), 1)
        useCartStore.getState().addItem(product({ _id: 'p2' }), 1)
      })
      act(() => useCartStore.getState().removeItem('p1'))
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0]._id).toBe('p2')
    })
  })

  describe('clearCart', () => {
    it('empties the cart', () => {
      act(() => {
        useCartStore.getState().addItem(product(), 3)
      })
      act(() => useCartStore.getState().clearCart())
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe('count and subtotal', () => {
    it('returns total quantity across all items', () => {
      act(() => {
        useCartStore.getState().addItem(product({ _id: 'p1' }), 2)
        useCartStore.getState().addItem(product({ _id: 'p2' }), 3)
      })
      expect(useCartStore.getState().count()).toBe(5)
    })

    it('calculates subtotal correctly', () => {
      act(() => {
        useCartStore.getState().addItem(product({ _id: 'p1', price: 89000 }), 2)
        useCartStore.getState().addItem(product({ _id: 'p2', price: 32000 }), 1)
      })
      expect(useCartStore.getState().subtotal()).toBe(89000 * 2 + 32000)
    })

    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().count()).toBe(0)
      expect(useCartStore.getState().subtotal()).toBe(0)
    })
  })
})
