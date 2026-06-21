import { AlertTriangle, Package, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState'
import api from '../../services/api'
import { formatCurrency } from '../../utils/format'

const LOW_STOCK_THRESHOLD = 5

export default function AdminInventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [saving, setSaving] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/admin/products')
      setProducts(res.data)
    } catch {
      setError('No se pudo cargar el inventario.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return products
      .filter((p) => {
        const matchesTerm = !term || p.name.toLowerCase().includes(term) || (p.sku || '').toLowerCase().includes(term)
        if (filter === 'low') return matchesTerm && p.stock <= LOW_STOCK_THRESHOLD
        if (filter === 'out') return matchesTerm && p.stock === 0
        if (filter === 'active') return matchesTerm && p.isActive
        return matchesTerm
      })
      .sort((a, b) => a.stock - b.stock)
  }, [products, query, filter])

  async function updateStock(product, newStock) {
    const value = parseInt(newStock, 10)
    if (isNaN(value) || value < 0) return
    setSaving((s) => ({ ...s, [product._id]: true }))
    try {
      await api.put(`/admin/products/${product._id}`, { ...product, stock: value })
      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, stock: value } : p)))
    } catch {
      setError('No se pudo actualizar el stock.')
    } finally {
      setSaving((s) => ({ ...s, [product._id]: false }))
    }
  }

  const lowStockCount = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  return (
    <section>
      <h1 className="font-display text-5xl font-bold text-forest">Inventario</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Productos totales" value={products.length} icon={Package} />
        <StatCard label="Bajo stock (≤ 5)" value={lowStockCount} icon={AlertTriangle} highlight={lowStockCount > 0} />
        <StatCard label="Sin stock" value={outOfStockCount} icon={AlertTriangle} highlight={outOfStockCount > 0} danger />
      </div>

      <div className="mt-6 grid gap-3 rounded-lg border border-gold/20 bg-white p-4 md:grid-cols-[1fr_200px]">
        <label className="relative">
          <span className="sr-only">Buscar producto</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-incense/50" size={18} />
          <input
            className="h-11 w-full rounded-md border border-gold/30 pl-10 pr-3"
            placeholder="Nombre o SKU"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          className="h-11 rounded-md border border-gold/30 px-3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="low">Bajo stock</option>
          <option value="out">Sin stock</option>
          <option value="active">Solo activos</option>
        </select>
      </div>

      {error && <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="mt-8"><LoadingState /></div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gold/20 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10 text-left text-xs font-bold uppercase tracking-wider text-incense/50">
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3 text-right">Precio</th>
                <th className="px-5 py-3 text-right">Stock actual</th>
                <th className="px-5 py-3 text-center">Ajustar stock</th>
                <th className="px-5 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-incense/60">No hay productos con esos filtros.</td></tr>
              ) : filtered.map((product) => {
                const isLow = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD
                const isOut = product.stock === 0
                return (
                  <tr key={product._id} className={`border-b border-gold/10 last:border-0 ${isOut ? 'bg-red-50' : isLow ? 'bg-amber-50' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.mainImage && <img src={product.mainImage} alt="" className="size-10 rounded-md bg-ritual object-cover" loading="lazy" />}
                        <div>
                          <p className="font-semibold text-forest">{product.name}</p>
                          <p className="text-xs text-incense/60">{product.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-incense/70">{product.sku || '—'}</td>
                    <td className="px-5 py-4 text-right font-semibold">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={`font-bold ${isOut ? 'text-red-700' : isLow ? 'text-amber-700' : 'text-forest'}`}>
                        {product.stock}
                      </span>
                      {isOut && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">Sin stock</span>}
                      {isLow && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">Bajo stock</span>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StockInput
                        value={product.stock}
                        saving={saving[product._id]}
                        onSave={(v) => updateStock(product, v)}
                      />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function StockInput({ value, saving, onSave }) {
  const [local, setLocal] = useState(String(value))

  useEffect(() => {
    setLocal(String(value))
  }, [value])

  return (
    <div className="flex items-center justify-center gap-2">
      <input
        type="number"
        min={0}
        className="h-9 w-20 rounded-md border border-gold/30 px-2 text-center text-sm"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSave(local)}
        disabled={saving}
      />
      <button
        type="button"
        onClick={() => onSave(local)}
        disabled={saving || local === String(value)}
        className="rounded-md bg-forest px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40 hover:bg-forest/90"
      >
        {saving ? '...' : 'OK'}
      </button>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, highlight, danger }) {
  return (
    <div className={`rounded-lg border p-5 shadow-soft ${danger ? 'border-red-200 bg-red-50' : highlight ? 'border-amber-200 bg-amber-50' : 'border-gold/20 bg-white'}`}>
      <Icon className={danger ? 'text-red-600' : highlight ? 'text-amber-600' : 'text-terracotta'} size={22} />
      <p className={`mt-3 text-xs font-bold uppercase tracking-wider ${danger ? 'text-red-600' : highlight ? 'text-amber-700' : 'text-incense/60'}`}>{label}</p>
      <strong className={`mt-1 block text-3xl ${danger ? 'text-red-700' : highlight ? 'text-amber-800' : 'text-forest'}`}>{value}</strong>
    </div>
  )
}
