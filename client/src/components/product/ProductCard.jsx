import { Eye, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency } from '../../utils/format'
import Button from '../ui/Button'

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const outOfStock = product.stock <= 0

  return (
    <article className="overflow-hidden rounded-lg border border-gold/20 bg-white shadow-soft">
      <Link to={`/producto/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-ritual">
        <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={product.mainImage} alt={product.name} loading="lazy" decoding="async" />
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">{product.intention}</span>
          <span className="text-xs font-semibold text-incense/70">{product.categoryName}</span>
        </div>
        <h3 className="mt-3 min-h-14 font-display text-2xl font-bold leading-7 text-forest">{product.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-incense/80">{product.shortDescription}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-deep">{formatCurrency(product.price)}</p>
            {product.compareAtPrice > 0 && <p className="text-sm text-incense/50 line-through">{formatCurrency(product.compareAtPrice)}</p>}
          </div>
          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${outOfStock ? 'bg-red-50 text-red-700' : 'bg-ritual text-forest'}`}>
            {outOfStock ? 'Agotado' : `${product.stock} disp.`}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" to={`/producto/${product.slug}`}>
            <Eye size={17} /> Ver
          </Button>
          <Button disabled={outOfStock} onClick={() => addItem(product)}>
            <ShoppingBag size={17} /> Agregar
          </Button>
        </div>
      </div>
    </article>
  )
}
