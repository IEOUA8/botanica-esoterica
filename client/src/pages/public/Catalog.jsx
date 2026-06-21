import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/product/ProductCard'
import { EmptyState, ErrorState } from '../../components/ui/AsyncState'
import { SkeletonGrid } from '../../components/ui/SkeletonCard'
import Pagination from '../../components/ui/Pagination'
import api from '../../services/api'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más reciente' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'best_seller', label: 'Más vendido' },
]

const initialPagination = { page: 1, totalPages: 1, total: 0 }

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gold/12 py-4">
      <button
        className="flex w-full items-center justify-between text-sm font-bold uppercase tracking-[0.15em] text-deep"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [intentions, setIntentions] = useState([])
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    intention: searchParams.get('intention') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page') || 1),
  })

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      const params = Object.fromEntries(
        Object.entries({ ...filters, limit: 12 }).filter(([, v]) => v !== '')
      )
      setLoading(true)
      setError('')
      setSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v && v !== 1 && v !== 'newest')
        ),
        { replace: true }
      )
      try {
        const { data } = await api.get('/products', { params, signal: controller.signal })
        setProducts(data.items)
        setPagination(data.pagination)
        setIntentions(data.facets.intentions)
      } catch (err) {
        if (err.code !== 'ERR_CANCELED')
          setError(err.response?.data?.message || 'No se pudo cargar el catálogo.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, filters.search ? 300 : 0)

    return () => { clearTimeout(timer); controller.abort() }
  }, [filters, requestVersion, setSearchParams])

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value, page: key === 'page' ? value : 1 }))
  }

  function clearFilters() {
    setFilters({ search: '', category: '', intention: '', sort: 'newest', page: 1 })
  }

  const activeCount = [filters.category, filters.intention, filters.search].filter(Boolean).length

  const Sidebar = (
    <div className="flex flex-col">
      {/* Search */}
      <div className="relative mb-2">
        <input
          className="h-10 w-full rounded-lg border border-gold/20 bg-white px-3 pr-8 text-sm outline-none focus:border-forest"
          placeholder="Buscar producto..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-incense/40 hover:text-deep"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Categoría">
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => updateFilter('category', '')}
            className={`rounded-lg px-3 py-2 text-left text-sm transition ${
              !filters.category
                ? 'bg-forest text-white font-semibold'
                : 'text-incense/70 hover:bg-ritual'
            }`}
          >
            Todas las categorías
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilter('category', cat.slug)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                filters.category === cat.slug
                  ? 'bg-forest text-white font-semibold'
                  : 'text-incense/70 hover:bg-ritual'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Intention */}
      {intentions.length > 0 && (
        <FilterSection title="Intención">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => updateFilter('intention', '')}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                !filters.intention
                  ? 'bg-forest text-white font-semibold'
                  : 'text-incense/70 hover:bg-ritual'
              }`}
            >
              Todas
            </button>
            {intentions.map((int) => (
              <button
                key={int}
                onClick={() => updateFilter('intention', int)}
                className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                  filters.intention === int
                    ? 'bg-forest text-white font-semibold'
                    : 'text-incense/70 hover:bg-ritual'
                }`}
              >
                {int}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Sort */}
      <FilterSection title="Ordenar por" defaultOpen={false}>
        <div className="flex flex-col gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('sort', opt.value)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                filters.sort === opt.value
                  ? 'bg-forest text-white font-semibold'
                  : 'text-incense/70 hover:bg-ritual'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={clearFilters}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline"
        >
          <X size={13} /> Limpiar filtros ({activeCount})
        </button>
      )}
    </div>
  )

  return (
    <main className="bg-warm py-12">
      <div className="section-shell">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Tienda</p>
            <h1 className="mt-2 font-display text-5xl font-bold text-forest">
              Catálogo espiritual
            </h1>
            <p className="mt-2 text-sm text-incense/60">
              Filtra por intención o categoría para encontrar tu elemento ritual.
            </p>
          </div>
          {/* Mobile filter button */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-gold/20 bg-white px-4 py-2.5 text-sm font-semibold text-deep shadow-card transition hover:shadow-card-hover lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-forest text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="mb-6 rounded-xl border border-gold/15 bg-white p-5 shadow-card lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-widest text-deep">Filtros</p>
              <button onClick={() => setSidebarOpen(false)} className="text-incense/50 hover:text-deep">
                <X size={18} />
              </button>
            </div>
            {Sidebar}
          </div>
        )}

        {/* Main layout */}
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] rounded-xl border border-gold/15 bg-white p-5 shadow-card">
              {Sidebar}
            </div>
          </aside>

          {/* Products area */}
          <section>
            {!loading && !error && (
              <p className="mb-5 text-sm text-incense/50">
                {pagination.total} producto{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
              </p>
            )}

            {loading ? (
              <SkeletonGrid count={9} cols={3} />
            ) : error ? (
              <ErrorState
                message={error}
                onRetry={() => setRequestVersion((v) => v + 1)}
              />
            ) : products.length ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onChange={(page) => updateFilter('page', page)}
                />
              </>
            ) : (
              <EmptyState message="No encontramos productos con esos filtros." />
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
