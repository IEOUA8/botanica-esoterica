import { Eye, Expand, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAddToCart } from '../../hooks/useAddToCart'
import { useQuickViewStore } from '../../store/quickViewStore'
import { formatCurrency } from '../../utils/format'

export default function ProductCard({ product }) {
  const addToCart = useAddToCart()
  const openQuickView = useQuickViewStore((state) => state.openQuickView)
  const outOfStock = product.stock <= 0
  const hasDiscount = product.compareAtPrice > 0 && product.compareAtPrice > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-card-hover">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ritual">
        <Link to={`/producto/${product.slug}`}>
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={product.mainImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-terracotta px-2.5 py-1 text-xs font-bold text-white">
            -{discountPct}%
          </span>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-deep/35">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-deep shadow">
              Agotado
            </span>
          </div>
        )}

        {/* Hover actions overlay */}
        {!outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-forest/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={() => openQuickView(product)}
              title="Vista rápida"
              className="grid size-11 place-items-center rounded-full bg-white text-forest shadow transition hover:bg-ritual"
            >
              <Expand size={18} />
            </button>
            <Link
              to={`/producto/${product.slug}`}
              title="Ver producto"
              className="grid size-11 place-items-center rounded-full bg-white text-forest shadow transition hover:bg-ritual"
            >
              <Eye size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            {product.intention}
          </span>
          <span className="text-[10px] font-medium text-incense/50">{product.categoryName}</span>
        </div>

        <h3 className="mt-2.5 line-clamp-2 font-display text-xl font-bold leading-snug text-forest">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-incense/60">
          {product.shortDescription}
        </p>

        {/* Price + add */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-deep">{formatCurrency(product.price)}</p>
            {hasDiscount && (
              <p className="text-xs text-incense/40 line-through">
                {formatCurrency(product.compareAtPrice)}
              </p>
            )}
          </div>
          <button
            disabled={outOfStock}
            onClick={() => addToCart(product)}
            aria-label={`Agregar ${product.name} al carrito`}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-white transition hover:bg-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}
