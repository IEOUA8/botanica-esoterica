import { ArrowRight, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchStore } from '../../store/searchStore'
import api from '../../services/api'
import { formatCurrency } from '../../utils/format'

export default function SearchOverlay() {
  const { open, closeSearch } = useSearchStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      api
        .get(`/products?search=${encodeURIComponent(query.trim())}&limit=6`)
        .then((res) => { if (!cancelled) setResults(res.data.items || []) })
        .catch(() => {})
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 300)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [query])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeSearch() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeSearch])

  const showEmpty = !loading && query.length > 1 && results.length === 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-warm/97 backdrop-blur-md"
        >
          <div className="section-shell flex flex-1 flex-col py-8">
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
                Buscar productos
              </p>
              <button
                onClick={closeSearch}
                className="grid size-9 place-items-center rounded-lg text-deep/60 transition hover:bg-ritual hover:text-deep"
                aria-label="Cerrar búsqueda"
              >
                <X size={20} />
              </button>
            </div>

            {/* Input */}
            <div className="relative mt-6">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-incense/35"
                size={22}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca velas, hierbas, amuletos..."
                className="h-16 w-full rounded-2xl border border-gold/25 bg-white pl-14 pr-5 font-display text-2xl text-deep shadow-card outline-none transition focus:border-forest focus:shadow-soft"
              />
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-ritual" />
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
              <div className="mt-8">
                <p className="mb-5 text-xs font-semibold text-incense/50">
                  {results.length} resultado{results.length !== 1 ? 's' : ''}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((product) => (
                    <Link
                      key={product._id}
                      to={`/producto/${product.slug}`}
                      onClick={closeSearch}
                      className="group flex items-center gap-4 rounded-xl border border-gold/15 bg-white p-3 transition hover:border-forest/25 hover:shadow-card"
                    >
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="size-16 shrink-0 rounded-lg bg-ritual object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-deep group-hover:text-forest">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-[10px] text-incense/50">{product.categoryName}</p>
                        <p className="mt-1 text-sm font-bold text-forest">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Link
                    to={`/tienda?search=${encodeURIComponent(query)}`}
                    onClick={closeSearch}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
                  >
                    Ver todos los resultados <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* Empty */}
            {showEmpty && (
              <div className="mt-20 text-center">
                <p className="font-display text-3xl font-bold text-forest">Sin resultados</p>
                <p className="mt-3 text-sm text-incense/60">
                  Intenta con otro término o explora el catálogo completo.
                </p>
                <Link
                  to="/tienda"
                  onClick={closeSearch}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-deep"
                >
                  Ver catálogo <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Idle state */}
            {!query && (
              <div className="mt-16 text-center">
                <p className="font-display text-2xl font-bold text-forest/25">
                  ¿Qué elemento buscas hoy?
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
