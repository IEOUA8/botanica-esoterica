import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item._id === product._id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
                  : item
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                _id: product._id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.mainImage,
                stock: product.stock,
                quantity,
              },
            ],
          }
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
        })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item._id !== id) })),
      clearCart: () => set({ items: [] }),
      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'bei_cart',
      version: 2,
      migrate: (persistedState, version) => (version < 2 ? { ...persistedState, items: [] } : persistedState),
    }
  )
)
