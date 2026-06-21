import { ArrowRight, Globe2, HeartHandshake, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import api, { WHATSAPP_NUMBER } from '../../services/api'
import Button from '../../components/ui/Button'
import ProductCard from '../../components/product/ProductCard'

const heroImage = 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1400&q=85'

const benefits = [
  [ShoppingBag, 'Compra sin registrarte'],
  [Sparkles, 'Productos seleccionados con intención'],
  [Globe2, 'Envíos nacionales e internacionales'],
  [MessageCircle, 'Asesoría por WhatsApp'],
]

const steps = [
  ['Define tu intención', 'Amor, protección, abundancia, limpieza o equilibrio espiritual.'],
  ['Elige el elemento ritual', 'Velas, hierbas, sahumerios, aceites, baños o amuletos.'],
  ['Prepara tu espacio', 'Crea un momento claro, tranquilo y respetuoso.'],
  ['Realiza tu práctica', 'Acompaña tu intención con presencia, fe y disciplina.'],
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    Promise.all([api.get('/products/featured'), api.get('/categories')]).then(([productRes, categoryRes]) => {
      setProducts(productRes.data)
      setCategories(categoryRes.data.slice(0, 4))
    })
  }, [])

  return (
    <main>
      <section className="bg-forest text-white">
        <div className="section-shell grid min-h-[calc(100vh-80px)] items-center gap-10 py-12 lg:grid-cols-[1fr_0.92fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">Conecta con la energía que transforma tu camino</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.98] sm:text-6xl lg:text-7xl">
              Botánica esotérica para transformar tu energía
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ritual/85">
              Productos rituales, amuletos, velas, hierbas y elementos espirituales para intencionar amor, abundancia, protección, salud y prosperidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/tienda">Comprar ahora <ArrowRight size={18} /></Button>
              <Button variant="secondary" to="/tienda?category=kits-rituales">Ver kits rituales</Button>
            </div>
          </motion.div>
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-gold/30">
            <img className="absolute inset-0 h-full w-full object-cover" src={heroImage} alt="Composición ritual con velas, hierbas y elementos espirituales" />
            <div className="image-overlay absolute inset-0" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-display text-3xl font-bold">Kit de Abundancia Dorada</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-ritual/85">Kits preparados para acompañar prácticas de prosperidad, claridad, amor y protección espiritual.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ritual py-8">
        <div className="section-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 rounded-lg bg-warm p-4 shadow-soft">
              <Icon className="text-terracotta" size={22} />
              <span className="font-semibold text-deep">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="section-shell">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">Elige la intención</p>
              <h2 className="mt-2 font-display text-4xl font-bold text-forest">Categorías destacadas</h2>
            </div>
            <Button variant="outline" to="/tienda">Ver catálogo</Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <a key={category._id} href={`/tienda?category=${category.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
                <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={category.image} alt={category.name} />
                <div className="image-overlay absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-3xl font-bold">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ritual/85">{category.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm pb-16">
        <div className="section-shell">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">Nuestros productos</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-forest">Elementos espirituales seleccionados</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="bg-deep py-16 text-white">
        <div className="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Abre caminos hacia la abundancia</p>
            <h2 className="mt-2 font-display text-5xl font-bold">Rituales para abrir caminos de prosperidad</h2>
            <p className="mt-4 max-w-2xl text-ritual/80">Encuentra kits preparados para acompañar tus intenciones de abundancia, claridad, amor y protección espiritual.</p>
          </div>
          <Button variant="secondary" to="/tienda?category=kits-rituales">Explorar kits</Button>
        </div>
      </section>

      <section className="py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">Guía espiritual</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-forest">Cómo elegir tu producto espiritual</h2>
            <p className="mt-4 leading-7 text-incense/80">Cada producto acompaña tu intención, tu fe y tu disciplina espiritual sin prometer resultados absolutos.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map(([title, text], index) => (
              <div key={title} className="rounded-lg border border-gold/20 bg-ritual p-5">
                <span className="grid size-9 place-items-center rounded-md bg-forest font-bold text-gold">{index + 1}</span>
                <h3 className="mt-4 font-display text-2xl font-bold text-forest">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-incense/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ritual py-16">
        <div className="section-shell grid gap-5 md:grid-cols-4">
          {[
            'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1600421683121-ef6f943f8cba?auto=format&fit=crop&w=700&q=80',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80',
          ].map((image) => (
            <img key={image} className="aspect-square rounded-lg object-cover shadow-soft" src={image} alt="Galería visual de productos espirituales" />
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="section-shell grid gap-8 rounded-lg border border-gold/20 bg-white p-6 shadow-soft md:grid-cols-[1fr_1fr] md:p-8">
          <div>
            <HeartHandshake className="text-terracotta" size={32} />
            <h2 className="mt-4 font-display text-4xl font-bold text-forest">Recibe rituales, novedades y ofertas especiales</h2>
            <p className="mt-3 text-incense/80">También puedes escribirnos por WhatsApp para recibir asesoría antes de comprar.</p>
          </div>
          <form className="grid gap-3">
            <input className="rounded-md border border-gold/30 px-4 py-3 outline-none focus:border-terracotta" placeholder="Nombre" />
            <input className="rounded-md border border-gold/30 px-4 py-3 outline-none focus:border-terracotta" placeholder="Email o WhatsApp" />
            <Button type="button" href={`https://wa.me/${WHATSAPP_NUMBER}`}>Contactar por WhatsApp</Button>
          </form>
        </div>
      </section>
    </main>
  )
}
