import { useEffect, useState } from 'react'
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

  function load() {
    api.get('/admin/orders').then((res) => setOrders(res.data)).catch(() => setError('No se pudieron cargar los pedidos.'))
  }

  useEffect(load, [])

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
      {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      <div className="mt-8 overflow-hidden rounded-lg border border-gold/20 bg-white shadow-soft">
        {orders.length ? orders.map((order) => (
          <article key={order._id} className="grid gap-4 border-b border-gold/10 p-5 xl:grid-cols-[1fr_150px_180px_180px] xl:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-forest">{order.orderNumber}</h2>
              <p className="text-sm text-incense/80">{order.customer.fullName} · {order.customer.phone} · {order.customer.city}</p>
              <p className="mt-2 text-sm font-semibold text-terracotta">{formatCurrency(order.total)}</p>
              <p className="mt-1 text-xs text-incense/60">{order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}</p>
            </div>
            <Select value={order.orderStatus} options={[order.orderStatus, ...(orderTransitions[order.orderStatus] || [])]} onChange={(value) => update(order, 'status', { orderStatus: value })} />
            <Select value={order.paymentStatus} options={paymentStatuses} onChange={(value) => update(order, 'payment-status', { paymentStatus: value })} />
            <Select value={order.shippingStatus} options={shippingStatuses} onChange={(value) => update(order, 'shipping-status', { shippingStatus: value })} />
          </article>
        )) : (
          <div className="p-10 text-center font-semibold text-forest">Aún no hay pedidos.</div>
        )}
      </div>
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
