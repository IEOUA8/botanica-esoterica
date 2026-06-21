import { ExternalLink, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import api from '../../services/api'
import { formatCurrency } from '../../utils/format'

const orderTransitions = {
  Nuevo: ['Confirmado', 'Cancelado'],
  Confirmado: ['En preparación', 'Cancelado'],
  'En preparación': ['Despachado', 'Cancelado'],
  Despachado: ['Entregado'],
  Entregado: [],
  Cancelado: [],
}
const paymentStatuses = ['Pendiente', 'Pagado', 'Rechazado', 'Reembolsado']
const shippingStatuses = ['Pendiente de despacho', 'En preparación', 'Despachado', 'Entregado']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredOrders = useMemo(() => {
    const term = query.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesTerm = !term || `${order.orderNumber} ${order.customer.fullName} ${order.customer.phone}`.toLowerCase().includes(term)
      return matchesTerm && (!statusFilter || order.orderStatus === statusFilter)
    })
  }, [orders, query, statusFilter])

  function load() {
    setLoading(true)
    api.get('/admin/orders').then((res) => setOrders(res.data)).catch(() => setError('No se pudieron cargar los pedidos.')).finally(() => setLoading(false))
  }

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [])

  async function update(order, route, payload) {
    setError('')
    try {
      await api.put(`/admin/orders/${order._id}/${route}`, payload)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el pedido.')
    }
  }

  return (
    <section>
      <h1 className="font-display text-5xl font-bold text-forest">Pedidos</h1>
      <div className="mt-6 grid gap-3 rounded-lg border border-gold/20 bg-white p-4 md:grid-cols-[1fr_240px]">
        <label className="relative"><span className="sr-only">Buscar pedidos</span><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-incense/50" size={18} /><input className="h-11 w-full rounded-md border border-gold/30 pl-10 pr-3" placeholder="Pedido, cliente o teléfono" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label><span className="sr-only">Filtrar por estado</span><select className="h-11 w-full rounded-md border border-gold/30 px-3" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">Todos los estados</option>{Object.keys(orderTransitions).map((status) => <option key={status}>{status}</option>)}</select></label>
      </div>
      {error && <div className="mt-4"><ErrorState message={error} onRetry={load} /></div>}
      {loading ? <div className="mt-8"><LoadingState /></div> : filteredOrders.length ? <div className="mt-8 overflow-hidden rounded-lg border border-gold/20 bg-white shadow-soft">
        {filteredOrders.map((order) => (
          <article key={order._id} className="grid gap-4 border-b border-gold/10 p-5 xl:grid-cols-[1fr_150px_180px_180px] xl:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl font-bold text-forest">{order.orderNumber}</h2>
                <Link to={`/admin/pedidos/${order._id}`} className="flex items-center gap-1 text-xs font-semibold text-terracotta hover:underline">
                  <ExternalLink size={13} /> Ver detalle
                </Link>
              </div>
              <p className="text-sm text-incense/80">{order.customer.fullName} · {order.customer.phone} · {order.customer.city}</p>
              <p className="mt-2 text-sm font-semibold text-terracotta">{formatCurrency(order.total)}</p>
              <p className="mt-1 text-xs text-incense/60">{order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}</p>
            </div>
            <Select value={order.orderStatus} options={[order.orderStatus, ...(orderTransitions[order.orderStatus] || [])]} onChange={(value) => update(order, 'status', { orderStatus: value })} />
            <Select value={order.paymentStatus} options={paymentStatuses} onChange={(value) => update(order, 'payment-status', { paymentStatus: value })} />
            <Select value={order.shippingStatus} options={shippingStatuses} onChange={(value) => update(order, 'shipping-status', { shippingStatus: value })} />
          </article>
        ))}
      </div> : <div className="mt-8"><EmptyState message={orders.length ? 'No hay pedidos con esos filtros.' : 'Aún no hay pedidos.'} /></div>}
    </section>
  )
}

function Select({ value, options, onChange }) {
  return (
    <select className="h-11 rounded-md border border-gold/30 px-3" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  )
}
