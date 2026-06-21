import { MessageCircle, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState'
import api, { WHATSAPP_NUMBER } from '../../services/api'
import { useCartStore } from '../../store/cartStore'
import { encodeWhatsapp, formatCurrency } from '../../utils/format'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProduct(null)
      setError('')
      api.get(`/products/${slug}`).then((res) => setProduct(res.data)).catch((err) => setError(err.response?.data?.message || 'No se pudo cargar el producto.'))
    }, 0)
    return () => clearTimeout(timer)
  }, [slug, requestVersion])

  if (error) return <main className="section-shell py-16"><ErrorState message={error} onRetry={() => setRequestVersion((value) => value + 1)} /></main>
  if (!product) return <main className="section-shell py-16"><LoadingState message="Cargando producto..." /></main>

  const whatsappMessage = `Hola, quiero información para comprar ${quantity} x ${product.name}.`
  const outOfStock = product.stock <= 0

  return (
    <main className="bg-warm py-12">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-lg bg-ritual shadow-soft">
          <img className="aspect-square w-full object-cover" src={product.mainImage} alt={product.name} decoding="async" />
        </div>
        <section>
          <Link to="/tienda" className="text-sm font-bold uppercase tracking-[0.18em] text-terracotta">Volver a tienda</Link>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-forest">{product.name}</h1>
          <p className="mt-3 text-lg text-incense/80">{product.shortDescription}</p>
          <div className="mt-5 flex flex-wrap items-end gap-4">
            <p className="text-3xl font-bold text-deep">{formatCurrency(product.price)}</p>
            {product.compareAtPrice > 0 && <p className="text-lg text-incense/50 line-through">{formatCurrency(product.compareAtPrice)}</p>}
          </div>
          <div className="mt-6 grid gap-3 rounded-lg border border-gold/20 bg-ritual p-5 sm:grid-cols-3">
            <Info label="Categoría" value={product.categoryName} />
            <Info label="Intención" value={product.intention} />
            <Info label="Stock" value={outOfStock ? 'Agotado' : `${product.stock} disponibles`} />
          </div>
          <p className="mt-6 leading-8 text-incense/90">{product.description}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex h-12 items-center rounded-md border border-gold/30 bg-white">
              <button className="px-3" aria-label="Reducir cantidad" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={18} /></button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button className="px-3" aria-label="Aumentar cantidad" onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))}><Plus size={18} /></button>
            </div>
            <Button disabled={outOfStock} onClick={() => addItem(product, quantity)}><ShoppingBag size={18} /> Agregar al carrito</Button>
            <Button variant="secondary" href={encodeWhatsapp(WHATSAPP_NUMBER, whatsappMessage)}><MessageCircle size={18} /> Comprar por WhatsApp</Button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Detail title="Modo de uso ritual" text={product.ritualUse} />
            <Detail title="Ingredientes o composición" text={(product.ingredients || []).join(', ')} />
          </div>
          <div className="mt-5 rounded-lg border border-terracotta/20 bg-terracotta/5 p-4 text-sm leading-6 text-incense">
            {product.warnings}
          </div>
        </section>
      </div>
    </main>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">{label}</p>
      <p className="mt-1 font-semibold text-forest">{value}</p>
    </div>
  )
}

function Detail({ title, text }) {
  return (
    <article className="rounded-lg border border-gold/20 bg-white p-5">
      <h2 className="font-display text-2xl font-bold text-forest">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-incense/80">{text}</p>
    </article>
  )
}
