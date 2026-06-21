import { Boxes, PackageCheck, Send, ShoppingBag, TrendingUp, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { formatCurrency } from '../../utils/format'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState'

const cards = [
  ['totalProducts', 'Total productos', Boxes],
  ['activeProducts', 'Productos activos', PackageCheck],
  ['lowStock', 'Bajo stock', TriangleAlert],
  ['newOrders', 'Pedidos nuevos', ShoppingBag],
  ['pendingDispatch', 'Pendientes despacho', Send],
  ['totalSales', 'Ventas totales', TrendingUp],
]

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      setError('')
      api.get('/admin/dashboard/stats').then((res) => setStats(res.data)).catch(() => setError('No se pudo cargar el dashboard.')).finally(() => setLoading(false))
    }, 0)
    return () => clearTimeout(timer)
  }, [requestVersion])

  return (
    <section>
      <h1 className="font-display text-5xl font-bold text-forest">Dashboard</h1>
      {loading ? <div className="mt-8"><LoadingState /></div> : error ? <div className="mt-8"><ErrorState message={error} onRetry={() => setRequestVersion((value) => value + 1)} /></div> : (
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([key, label, Icon]) => (
          <article key={key} className="rounded-lg border border-gold/20 bg-white p-6 shadow-soft">
            <Icon className="text-terracotta" />
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-incense/60">{label}</p>
            <strong className="mt-2 block text-3xl text-forest">{key === 'totalSales' ? formatCurrency(stats[key]) : stats[key] ?? 0}</strong>
          </article>
        ))}
      </div>
      )}
    </section>
  )
}
