import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'

export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)

  return (product, quantity = 1) => {
    addItem(product, quantity)
    addToast({ product, quantity })
  }
}
