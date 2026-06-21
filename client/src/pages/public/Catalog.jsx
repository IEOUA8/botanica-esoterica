import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/product/ProductCard'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import Pagination from '../../components/ui/Pagination'
import api from '../../services/api'

const initialPagination = { page: 1, totalPages: 1, total: 0 }

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [intentions, setIntentions] = useState([])
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    intention: searchParams.get('intention') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page') || 1),
  })

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => setError('No se pudieron cargar las categorías.'))
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      const params = Object.fromEntries(Object.entries({ ...filters, limit: 12 }).filter(([, value]) => value !== ''))
      setLoading(true)
      setError('')
      setSearchParams(Object.fromEntries(Object.entries(filters).filter(([, value]) => value && value !== 1 && value !== 'newest')), { replace: true })
      try {
        const { data } = await api.get('/products', { params, signal: controller.signal })
        setProducts(data.items)
        setPagination(data.pagination)
        setIntentions(data.facets.intentions)
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') setError(err.response?.data?.message || 'No se pudo cargar el catálogo.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, filters.search ? 300 : 0)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [filters, requestVersion, setSearchParams])

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }))
  }

  return (
    <main className="bg-warm py-12">
      <div className="section-shell">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">Tienda</p>
          <h1 className="mt-2 font-display text-5xl font-bold text-forest">Catálogo espiritual</h1>
          <p className="mt-3 max-w-2xl text-incense/80">Filtra por intención, categoría o precio para encontrar el elemento ritual adecuado.</p>
        </div>

        <div className="mb-8 grid gap-3 rounded-lg border border-gold/20 bg-ritual p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <label className="relative">
            <span className="sr-only">Buscar productos</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-incense/50" size={18} />
            <input className="h-12 w-full rounded-md border border-gold/30 bg-white pl-10 pr-3 outline-none focus:border-terracotta" placeholder="Buscar producto" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
          </label>
          <FilterSelect label="Categoría" value={filters.category} onChange={(value) => updateFilter('category', value)}>
            <option value="">Todas las categorías</option>
            {categories.map((category) => <option key={category._id} value={category.slug}>{category.name}</option>)}
          </FilterSelect>
          <FilterSelect label="Intención" value={filters.intention} onChange={(value) => updateFilter('intention', value)}>
            <option value="">Todas las intenciones</option>
            {intentions.map((intention) => <option key={intention} value={intention}>{intention}</option>)}
          </FilterSelect>
          <FilterSelect label="Orden" value={filters.sort} onChange={(value) => updateFilter('sort', value)}>
            <option value="newest">Más reciente</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="best_seller">Más vendido</option>
          </FilterSelect>
        </div>

        {loading ? <LoadingState message="Cargando productos..." /> : error ? (
          <ErrorState message={error} onRetry={() => setRequestVersion((value) => value + 1)} />
        ) : products.length ? (
          <>
            <p className="mb-5 text-sm text-incense/70">{pagination.total} productos encontrados</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(page) => updateFilter('page', page)} />
          </>
        ) : <EmptyState message="No encontramos productos con esos filtros." />}
      </div>
    </main>
  )
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select className="h-12 w-full rounded-md border border-gold/30 bg-white px-3 outline-none focus:border-terracotta" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  )
}
