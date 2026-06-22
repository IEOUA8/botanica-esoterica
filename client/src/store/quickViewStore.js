import { create } from 'zustand'

export const useQuickViewStore = create((set) => ({
  product: null,
  openQuickView: (product) => set({ product }),
  closeQuickView: () => set({ product: null }),
}))
