import { ArrowRight, Globe2, HeartHandshake, Heart, Leaf, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { WHATSAPP_NUMBER } from '../../services/api'
import Button from '../../components/ui/Button'
import ProductCard from '../../components/product/ProductCard'
import { ErrorState } from '../../components/ui/AsyncState'
import { SkeletonGrid } from '../../components/ui/SkeletonCard'

const heroImage = 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1400&q=85'

const benefits = [
  [ShoppingBag, 'Compra sin registro'],
  [Sparkles, 'Seleccionados con intención'],
  [Globe2, 'Envíos internacionales'],
  [MessageCircle, 'Asesoría por WhatsApp'],
]

const ritualSteps = [
  [Sparkles, 'Define tu intención', 'Amor, protección, abundancia, limpieza o equilibrio espiritual. La claridad es el primer paso.'],
  [Leaf, 'Elige el elemento ritual', 'Velas, hierbas, sahumerios, aceites o amuletos seleccionados con propósito y respeto.'],
  [Heart, 'Realiza tu práctica', 'Acompaña tu intención con presencia, fe y disciplina. El ritual es un acto de amor propio.'],
]

const galleryImages = [
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1600421683121-ef6f943f8cba?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80',
]

const productTabs = [
  { id: 'featured', label: 'Destacados', endpoint: '/products/featured' },
  { id: 'newest', label: 'Lo nuevo', endpoint: '/products?limit=6' },
  { id: 'best_seller', label: 'Más vendidos', endpoint: '/products?sort=best_seller&limit=6' },
]

export default function Home() {
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [catError, setCatError] = useState('')

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [activeTab, setActiveTab] = useState('featured')
  const [retryKey, setRetryKey] = useState(0)
  const productCache = useRef({})

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setCategories(res.data.slice(0, 4)))
      .catch(() => setCatError('No se pudieron cargar las categorías.'))
      .finally(() => setLoadingCats(false))
  }, [])

  useEffect(() => {
    const cached = productCache.current[activeTab]
    if (cached) {
      setProducts(cached)
      setLoadingProducts(false)
      return
    }
    let cancelled = false
    setLoadingProducts(true)
    setProductsError('')
    const tab = productTabs.find((t) => t.id === activeTab)
    api
      .get(tab.endpoint)
      .then((res) => {
        if (cancelled) return
        const items = Array.isArray(res.data) ? res.data : res.data.items || []
        productCache.current[activeTab] = items
        setProducts(items)
      })
      .catch(() => { if (!cancelled) setProductsError('No se pudieron cargar los productos.') })
      .finally(() => { if (!cancelled) setLoadingProducts(false) })
    return () => { cancelled = true }
  }, [activeTab, retryKey])

  function handleRetry() {
    productCache.current[activeTab] = undefined
    setRetryKey((v) => v + 1)
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section className="overflow-hidden bg-forest text-white">
        <div className="section-shell grid min-h-[calc(100vh-108px)] items-center gap-10 py-16 lg:grid-cols-[1fr_0.88fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block rounded-full border border-gold/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-gold">
              Conecta con la energía que transforma
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
              Botánica<br />
              esotérica para<br />
              <em className="not-italic text-gold">transformar</em><br />
              tu energía
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-ritual/80">
              Rituales, amuletos, velas, hierbas y elementos espirituales para intencionar amor, abundancia, protección y prosperidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/tienda">
                Comprar ahora <ArrowRight size={16} />
              </Button>
              <Button variant="outline-light" to="/tienda?category=kits-rituales">
                Ver kits rituales
              </Button>
            </div>
          </motion.div>

          {/* Arch hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="relative h-[420px] w-[300px] sm:h-[500px] sm:w-[360px]">
              <div className="absolute inset-0 rounded-[50%_50%_10px_10px/58%_58%_10px_10px] bg-deep/50" />
              <img
                className="absolute inset-0 h-full w-full rounded-[50%_50%_10px_10px/58%_58%_10px_10px] object-cover"
                src={heroImage}
                alt="Elementos rituales botánicos"
              />
              {/* Price badge */}
              <div className="absolute -right-5 top-[38%] rounded-xl border border-gold/25 bg-warm px-4 py-3 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">Desde</p>
                <p className="font-display text-2xl font-bold text-forest">$12.000</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits strip ── */}
      <section className="bg-ritual py-6">
        <div className="section-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 rounded-xl bg-warm px-4 py-4 shadow-card">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest/10">
                <Icon className="text-forest" size={18} />
              </span>
              <span className="text-sm font-semibold text-deep">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured categories ── */}
      <section className="py-16">
        <div className="section-shell">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Elige tu intención</p>
              <h2 className="mt-2 font-display text-4xl font-bold text-forest">Categorías destacadas</h2>
            </div>
            <Button variant="outline" to="/tienda">
              Ver catálogo <ArrowRight size={14} />
            </Button>
          </div>

          {catError ? (
            <p className="text-sm text-red-600">{catError}</p>
          ) : loadingCats ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-ritual" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/tienda?category=${cat.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl"
                >
                  <img
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="image-overlay absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-display text-2xl font-bold">{cat.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-ritual/80">{cat.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gold">
                      Ver más <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Our Products with tabs ── */}
      <section className="bg-ritual/40 py-16">
        <div className="section-shell">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Nuestros productos</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-forest">Elementos espirituales seleccionados</h2>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex border-b border-gold/20">
            {productTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id ? 'text-forest' : 'text-incense/55 hover:text-forest'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest" />
                )}
              </button>
            ))}
          </div>

          {loadingProducts ? (
            <SkeletonGrid count={6} cols={3} />
          ) : productsError ? (
            <ErrorState message={productsError} onRetry={handleRetry} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Button variant="outline" to="/tienda">
              Ver todos los productos <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-deep py-16 text-white">
        <div className="section-shell grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Abre caminos hacia la abundancia</p>
            <h2 className="mt-3 font-display text-4xl font-bold lg:text-5xl">
              Rituales para prosperidad,<br className="hidden lg:block" /> amor y protección
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ritual/70">
              Kits preparados con elementos seleccionados para acompañar tus intenciones espirituales con claridad y propósito.
            </p>
          </div>
          <Button to="/tienda?category=kits-rituales">
            Explorar kits <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* ── Ritual steps ── */}
      <section className="py-16">
        <div className="section-shell">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Guía espiritual</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-forest">Cómo comenzar tu práctica</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-incense/65">
              Cada elemento acompaña tu intención y tu fe. No prometemos resultados absolutos, sí acompañamiento con respeto y propósito.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {ritualSteps.map(([Icon, title, text]) => (
              <div key={title} className="rounded-xl border border-gold/20 bg-white p-7 text-center shadow-card">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-forest">
                  <Icon className="text-gold" size={24} />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-forest">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-incense/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="bg-ritual py-12">
        <div className="section-shell grid grid-cols-2 gap-4 md:grid-cols-4">
          {galleryImages.map((src) => (
            <img
              key={src}
              src={src}
              alt="Galería espiritual"
              className="aspect-square rounded-xl object-cover shadow-card"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </section>

      {/* ── Newsletter / WhatsApp CTA ── */}
      <section className="py-16">
        <div className="section-shell overflow-hidden rounded-2xl bg-forest px-8 py-12 text-white shadow-soft md:px-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <HeartHandshake className="text-gold" size={30} />
              <h2 className="mt-4 font-display text-4xl font-bold">
                Recibe rituales, novedades y ofertas especiales
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-ritual/80">
                Escríbenos por WhatsApp para recibir asesoría personalizada antes de elegir tu próximo elemento espiritual.
              </p>
            </div>
            <Button variant="secondary" href={`https://wa.me/${WHATSAPP_NUMBER}`}>
              <MessageCircle size={16} /> Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
