import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuickViewStore } from '../../store/quickViewStore'
import { useAddToCart } from '../../hooks/useAddToCart'
import { formatCurrency } from '../../utils/format'
import Button from './Button'

export default function QuickViewModal() {
  const { product, closeQuickView } = useQuickViewStore()
  const addToCart = useAddToCart()
  const [quantity, setQuantity] = useState(1)

  useEffect(() => { setQuantity(1) }, [product?._id])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeQuickView() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeQuickView])

  const outOfStock = product?.stock <= 0
  const hasDiscount =
    product?.compareAtPrice > 0 && product?.compareAtPrice > product?.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-deep/50 backdrop-blur-sm"
            onClick={closeQuickView}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-2xl -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-soft"
          >
            {/* Close button */}
            <button
              onClick={closeQuickView}
              className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full bg-warm/90 text-deep/60 transition hover:bg-ritual hover:text-deep"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="aspect-square bg-ritual">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col p-6 md:p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                  {product.categoryName}
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-forest">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-incense/70">
                  {product.shortDescription}
                </p>

                {/* Price */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="font-display text-2xl font-bold text-deep">
                    {formatCurrency(product.price)}
                  </p>
                  {hasDiscount && (
                    <>
                      <p className="text-sm text-incense/40 line-through">
                        {formatCurrency(product.compareAtPrice)}
                      </p>
                      <span className="rounded-full bg-terracotta px-2.5 py-0.5 text-xs font-bold text-white">
                        -{discountPct}%
                      </span>
                    </>
                  )}
                </div>

                {/* Stock */}
                <span
                  className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    outOfStock
                      ? 'bg-red-50 text-red-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      outOfStock ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                  />
                  {outOfStock ? 'Agotado' : `${product.stock} disponibles`}
                </span>

                <div className="mt-auto pt-6">
                  {/* Quantity + Add */}
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-11 items-center gap-1 rounded-full border border-gold/30 px-2">
                      <button
                        onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                        className="grid size-7 place-items-center rounded-full hover:bg-ritual"
                        aria-label="Reducir"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold">{quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity((v) => Math.min(product.stock || 1, v + 1))
                        }
                        className="grid size-7 place-items-center rounded-full hover:bg-ritual"
                        aria-label="Aumentar"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <Button
                      disabled={outOfStock}
                      className="flex-1"
                      onClick={() => {
                        addToCart(product, quantity)
                        closeQuickView()
                      }}
                    >
                      <ShoppingBag size={15} /> Agregar
                    </Button>
                  </div>

                  {/* View detail link */}
                  <Link
                    to={`/producto/${product.slug}`}
                    onClick={closeQuickView}
                    className="mt-3 block text-center text-xs font-semibold text-incense/60 transition hover:text-forest"
                  >
                    Ver detalle completo →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
