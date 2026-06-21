import { Filter, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/product/ProductCard'
import api from '../../services/api'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    intention: searchParams.get('intention') || '',
    sort: searchParams.get('sort') || 'recent',
  })

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data))
  }, [])

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    api.get('/products', { params }).then((res) => setProducts(res.data)).finally(() => setLoaded(true))
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const intentions = useMemo(() => [...new Set(products.map((product) => product.intention))], [products])

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <main className="bg-warm py-12">
      <div className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">Tienda</p>
            <h1 className="mt-2 font-display text-5xl font-bold text-forest">Catálogo espiritual</h1>
            <p className="mt-3 max-w-2xl text-incense/80">Filtra por intención, categoría o precio para encontrar el elemento ritual adecuado.</p>
          </div>
        </div>

        <div className="mb-8 grid gap-3 rounded-lg border border-gold/20 bg-ritual p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-incense/50" size={18} />
            <input
              className="h-12 w-full rounded-md border border-gold/30 bg-white pl-10 pr-3 outline-none focus:border-terracotta"
              placeholder="Buscar producto"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </label>
          <select className="h-12 rounded-md border border-gold/30 bg-white px-3 outline-none focus:border-terracotta" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map((category) => <option key={category._id} value={category.slug}>{category.name}</option>)}
          </select>
          <select className="h-12 rounded-md border border-gold/30 bg-white px-3 outline-none focus:border-terracotta" value={filters.intention} onChange={(event) => updateFilter('intention', event.target.value)}>
            <option value="">Todas las intenciones</option>
            {intentions.map((intention) => <option key={intention} value={intention}>{intention}</option>)}
          </select>
          <select className="h-12 rounded-md border border-gold/30 bg-white px-3 outline-none focus:border-terracotta" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            <option value="recent">Más reciente</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="best_seller">Más vendido</option>
          </select>
        </div>

        {!loaded ? (
          <div className="rounded-lg bg-ritual p-10 text-center font-semibold text-forest">Cargando productos...</div>
        ) : products.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div className="rounded-lg bg-ritual p-10 text-center">
            <Filter className="mx-auto text-terracotta" />
            <p className="mt-3 font-semibold text-forest">No encontramos productos con esos filtros.</p>
          </div>
        )}
      </div>
    </main>
  )
}
