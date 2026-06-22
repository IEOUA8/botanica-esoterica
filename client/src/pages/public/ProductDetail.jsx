import { MessageCircle, Minus, Plus, ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Breadcrumbs from '../../components/ui/Breadcrumbs'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState'
import ProductCard from '../../components/product/ProductCard'
import api, { WHATSAPP_NUMBER } from '../../services/api'
import { useAddToCart } from '../../hooks/useAddToCart'
import { encodeWhatsapp, formatCurrency } from '../../utils/format'

const DETAIL_TABS = [
  { id: 'description', label: 'Descripción' },
  { id: 'ritual', label: 'Uso Ritual' },
  { id: 'ingredients', label: 'Ingredientes' },
  { id: 'warnings', label: 'Advertencias' },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [related, setRelated] = useState([])
  const [stickyVisible, setStickyVisible] = useState(false)
  const ctaRef = useRef(null)
  const addToCart = useAddToCart()

  useEffect(() => {
    const timer = setTimeout(() => {
      setProduct(null)
      setError('')
      setQuantity(1)
      setSelectedImage(0)
      setActiveTab('description')
      api
        .get(`/products/${slug}`)
        .then((res) => setProduct(res.data))
        .catch((err) =>
          setError(err.response?.data?.message || 'No se pudo cargar el producto.')
        )
    }, 0)
    return () => clearTimeout(timer)
  }, [slug, requestVersion])

  useEffect(() => {
    api
      .get('/products/featured')
      .then((res) => setRelated(Array.isArray(res.data) ? res.data : res.data.items || []))
      .catch(() => {})
  }, [])

  // Sticky bar via IntersectionObserver
  useEffect(() => {
    if (!ctaRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [product])

  if (error)
    return (
      <main className="section-shell py-16">
        <ErrorState message={error} onRetry={() => setRequestVersion((v) => v + 1)} />
      </main>
    )
  if (!product)
    return (
      <main className="section-shell py-16">
        <LoadingState message="Cargando producto..." />
      </main>
    )

  const outOfStock = product.stock <= 0
  const hasDiscount = product.compareAtPrice > 0 && product.compareAtPrice > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0
  const whatsappMessage = `Hola, me interesa comprar ${quantity} × ${product.name}. ¿Está disponible?`
  const images = product.images?.length ? product.images : [product.mainImage]
  const relatedFiltered = related.filter((p) => p.slug !== slug).slice(0, 4)

  return (
    <main className="bg-warm">
      {/* Breadcrumbs */}
      <div className="border-b border-gold/12 bg-ritual/30">
        <div className="section-shell py-3">
          <Breadcrumbs
            items={[
              { label: 'Tienda', href: '/tienda' },
              {
                label: product.categoryName,
                href: `/tienda?category=${product.categorySlug}`,
              },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* Product layout */}
      <div className="section-shell grid gap-12 py-14 lg:grid-cols-2">
        {/* Left: Image gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-ritual shadow-soft">
            <img
              className="h-full w-full object-cover"
              src={images[selectedImage] || product.mainImage}
              alt={product.name}
              decoding="async"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    selectedImage === idx
                      ? 'border-forest'
                      : 'border-gold/15 hover:border-gold/40'
                  }`}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product info */}
        <section className="flex flex-col">
          {/* Category + SKU */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">
              {product.categoryName}
            </span>
            {product.sku && (
              <span className="text-xs text-incense/40">SKU: {product.sku}</span>
            )}
          </div>

          {/* Name */}
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-forest lg:text-5xl">
            {product.name}
          </h1>

          {/* Intention */}
          <p className="mt-2 text-sm font-medium text-incense/50">{product.intention}</p>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <p className="font-display text-3xl font-bold text-deep">
              {formatCurrency(product.price)}
            </p>
            {hasDiscount && (
              <>
                <p className="text-lg text-incense/35 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </p>
                <span className="rounded-full bg-terracotta px-3 py-1 text-sm font-bold text-white">
                  -{discountPct}%
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          <p className="mt-4 text-base leading-7 text-incense/75">{product.shortDescription}</p>

          {/* Stock */}
          <div className="mt-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                outOfStock ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  outOfStock ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
              {outOfStock ? 'Agotado' : `${product.stock} disponibles`}
            </span>
          </div>

          <div className="my-6 border-t border-gold/12" />

          {/* CTA ref point for sticky bar */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-3">
            {/* Quantity picker */}
            <div className="inline-flex h-12 items-center gap-1 rounded-full border border-gold/25 bg-white px-2">
              <button
                className="grid size-8 place-items-center rounded-full text-deep transition hover:bg-ritual"
                aria-label="Reducir cantidad"
                onClick={() => setQuantity((v) => Math.max(1, v - 1))}
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button
                className="grid size-8 place-items-center rounded-full text-deep transition hover:bg-ritual"
                aria-label="Aumentar cantidad"
                onClick={() => setQuantity((v) => Math.min(product.stock || 1, v + 1))}
              >
                <Plus size={15} />
              </button>
            </div>

            <Button
              disabled={outOfStock}
              onClick={() => addToCart(product, quantity)}
              className="flex-1 sm:flex-none"
            >
              <ShoppingBag size={17} /> Agregar al carrito
            </Button>

            <Button
              variant="outline"
              href={encodeWhatsapp(WHATSAPP_NUMBER, whatsappMessage)}
              className="flex-1 sm:flex-none"
            >
              <MessageCircle size={17} /> WhatsApp
            </Button>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gold/20 px-3 py-1 text-xs text-incense/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Editorial section ── */}
      {product.ritualUse && (
        <div className="border-y border-gold/12 bg-ritual/25 py-10">
          <div className="section-shell grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
                La intención detrás de este producto
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-forest">
                Más que un producto,<br />un acompañante ritual
              </h2>
            </div>
            <blockquote className="border-l-2 border-gold/50 pl-6">
              <p className="font-display text-xl font-bold italic leading-relaxed text-forest/80">
                "{product.ritualUse}"
              </p>
            </blockquote>
          </div>
        </div>
      )}

      {/* ── Content tabs ── */}
      <div className="border-b border-gold/12">
        <div className="section-shell py-12">
          <div className="flex overflow-x-auto border-b border-gold/15">
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 px-6 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id ? 'text-forest' : 'text-incense/50 hover:text-forest'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 max-w-2xl text-base leading-8 text-incense/80">
            {activeTab === 'description' && <p>{product.description}</p>}
            {activeTab === 'ritual' && (
              <div>
                <h2 className="mb-4 font-display text-2xl font-bold text-forest">
                  Modo de uso ritual
                </h2>
                <p>{product.ritualUse || 'Información no disponible.'}</p>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div>
                <h2 className="mb-4 font-display text-2xl font-bold text-forest">
                  Ingredientes o composición
                </h2>
                {product.ingredients?.length ? (
                  <ul className="ml-5 list-disc space-y-2 text-sm">
                    {product.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No especificado.</p>
                )}
              </div>
            )}
            {activeTab === 'warnings' && (
              <div className="rounded-xl border border-terracotta/15 bg-terracotta/5 p-6">
                <p className="text-sm leading-7">
                  {product.warnings || 'Sin advertencias específicas para este producto.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {relatedFiltered.length > 0 && (
        <section className="bg-ritual/30 py-14">
          <div className="section-shell">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
                También te puede interesar
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-forest">
                Explora productos relacionados
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedFiltered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Sticky add-to-cart (mobile) ── */}
      <AnimatePresence>
        {stickyVisible && !outOfStock && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-0 left-0 right-0 z-30 border-t border-gold/15 bg-white/95 px-4 py-3 backdrop-blur-md shadow-soft lg:hidden"
          >
            <div className="mx-auto flex max-w-lg items-center gap-3">
              <img
                src={product.mainImage}
                alt=""
                className="size-11 shrink-0 rounded-lg bg-ritual object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-deep">{product.name}</p>
                <p className="text-xs font-bold text-forest">{formatCurrency(product.price)}</p>
              </div>
              <Button
                className="shrink-0"
                onClick={() => addToCart(product, quantity)}
              >
                <ShoppingBag size={16} /> Agregar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
