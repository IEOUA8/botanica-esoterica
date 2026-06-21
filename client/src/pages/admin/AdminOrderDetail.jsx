import { ArrowLeft, MessageCircle, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import Button from '../../components/ui/Button'
import api, { WHATSAPP_NUMBER } from '../../services/api'
import { encodeWhatsapp, formatCurrency } from '../../utils/format'

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

const statusColor = {
  Nuevo: 'bg-blue-100 text-blue-800',
  Confirmado: 'bg-indigo-100 text-indigo-800',
  'En preparación': 'bg-amber-100 text-amber-800',
  Despachado: 'bg-teal-100 text-teal-800',
  Entregado: 'bg-green-100 text-green-800',
  Cancelado: 'bg-red-100 text-red-800',
}

export default function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/admin/orders/${id}`)
      setOrder(res.data)
      setNote(res.data.adminNotes || '')
    } catch {
      setError('No se pudo cargar el pedido.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  async function updateField(route, payload) {
    setSaving(true)
    setError('')
    try {
      const res = await api.put(`/admin/orders/${id}/${route}`, payload)
      setOrder(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el pedido.')
    } finally {
      setSaving(false)
    }
  }

  async function saveNote() {
    await updateField('status', { orderStatus: order.orderStatus, adminNotes: note })
  }

  if (loading) return <LoadingState />
  if (error && !order) return <ErrorState message={error} onRetry={load} />
  if (!order) return <EmptyState message="Pedido no encontrado." />

  const whatsappMsg = buildWhatsappMessage(order)
  const nextStatuses = [order.orderStatus, ...(orderTransitions[order.orderStatus] || [])]

  return (
    <section className="grid gap-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/pedidos" className="flex items-center gap-2 text-sm font-semibold text-terracotta hover:underline">
          <ArrowLeft size={16} /> Todos los pedidos
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl font-bold text-forest">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-incense/70">{new Date(order.createdAt).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${statusColor[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
          {order.orderStatus}
        </span>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-5">
          {/* Productos */}
          <Card title="Productos del pedido">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-left text-incense/50">
                  <th className="pb-2 font-semibold">Producto</th>
                  <th className="pb-2 text-right font-semibold">Cant.</th>
                  <th className="pb-2 text-right font-semibold">Precio</th>
                  <th className="pb-2 text-right font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-gold/10 last:border-0">
                    <td className="py-3 font-semibold text-forest">{item.name}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-3 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {order.shippingCost > 0 && (
                  <tr className="text-incense/70">
                    <td colSpan={3} className="pt-3 text-right">Envío</td>
                    <td className="pt-3 text-right">{formatCurrency(order.shippingCost)}</td>
                  </tr>
                )}
                <tr className="text-lg font-bold text-forest">
                  <td colSpan={3} className="pt-2 text-right">Total</td>
                  <td className="pt-2 text-right">{formatCurrency(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </Card>

          {/* Notas internas */}
          <Card title="Nota interna del administrador">
            <textarea
              className="w-full rounded-md border border-gold/30 p-3 text-sm"
              rows={4}
              placeholder="Agrega notas internas sobre este pedido..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button className="mt-3" type="button" onClick={saveNote} disabled={saving}>
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar nota'}
            </Button>
          </Card>
        </div>

        <div className="grid gap-5">
          {/* Cliente */}
          <Card title="Cliente">
            <dl className="grid gap-2 text-sm">
              <Row label="Nombre" value={order.customer.fullName} />
              <Row label="WhatsApp" value={order.customer.phone} />
              <Row label="Email" value={order.customer.email || '—'} />
              <Row label="Ciudad" value={order.customer.city} />
              <Row label="Dirección" value={order.customer.address || '—'} />
              {order.customer.notes && <Row label="Notas del cliente" value={order.customer.notes} />}
            </dl>
            <a
              href={encodeWhatsapp(order.customer.phone?.replace(/\D/g, '') || WHATSAPP_NUMBER, whatsappMsg)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <MessageCircle size={16} /> Contactar por WhatsApp
            </a>
          </Card>

          {/* Estados */}
          <Card title="Estados del pedido">
            <div className="grid gap-3">
              <Field label="Estado del pedido">
                <select
                  className="h-10 w-full rounded-md border border-gold/30 px-3 text-sm"
                  value={order.orderStatus}
                  onChange={(e) => updateField('status', { orderStatus: e.target.value })}
                  disabled={saving}
                >
                  {nextStatuses.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Estado de pago">
                <select
                  className="h-10 w-full rounded-md border border-gold/30 px-3 text-sm"
                  value={order.paymentStatus}
                  onChange={(e) => updateField('payment-status', { paymentStatus: e.target.value })}
                  disabled={saving}
                >
                  {paymentStatuses.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Estado de despacho">
                <select
                  className="h-10 w-full rounded-md border border-gold/30 px-3 text-sm"
                  value={order.shippingStatus}
                  onChange={(e) => updateField('shipping-status', { shippingStatus: e.target.value })}
                  disabled={saving}
                >
                  {shippingStatuses.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Método de pago">
                <p className="text-sm font-semibold text-forest">{order.paymentMethod}</p>
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-white p-5 shadow-soft">
      <h2 className="mb-4 font-display text-2xl font-bold text-forest">{title}</h2>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-incense/60">{label}</dt>
      <dd className="text-right font-semibold text-forest">{value}</dd>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-bold uppercase tracking-wider text-incense/50">{label}</span>
      {children}
    </label>
  )
}

function buildWhatsappMessage(order) {
  const lines = [
    `Hola ${order.customer.fullName}, confirmamos tu pedido ${order.orderNumber}.`,
    '',
    'Productos:',
    ...order.items.map((i) => `• ${i.quantity} x ${i.name}: ${formatCurrency(i.price * i.quantity)}`),
    '',
    `Total: ${formatCurrency(order.total)}`,
    `Pago: ${order.paymentMethod}`,
  ]
  return lines.join('\n')
}
