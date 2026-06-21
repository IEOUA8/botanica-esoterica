import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency } from '../../utils/format'

const paymentMethods = ['Transferencia bancaria', 'Nequi', 'Daviplata', 'Pago contra entrega', 'WhatsApp para confirmar']

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.subtotal())
  const clearCart = useCartStore((state) => state.clearCart)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const idempotencyKey = useRef(crypto.randomUUID())
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    paymentMethod: paymentMethods[0],
    notes: '',
  })

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          city: form.city,
          address: form.address,
          notes: form.notes,
        },
        paymentMethod: form.paymentMethod,
        items: items.map((item) => ({ product: item._id, quantity: item.quantity })),
      }, { headers: { 'Idempotency-Key': idempotencyKey.current } })
      clearCart()
      navigate('/confirmacion', { state: data })
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear el pedido.')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <main className="section-shell py-16">
        <div className="rounded-lg bg-ritual p-10 text-center">
          <p className="font-semibold text-forest">No hay productos para finalizar compra.</p>
          <Button className="mt-5" to="/tienda">Volver a tienda</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-warm py-12">
      <div className="section-shell grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="rounded-lg border border-gold/20 bg-white p-6 shadow-soft">
          <h1 className="font-display text-5xl font-bold text-forest">Checkout sin registro</h1>
          <p className="mt-3 text-incense/80">Completa tus datos y confirmaremos la compra por WhatsApp o el método de pago seleccionado.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <Field label="Nombre completo" value={form.fullName} onChange={(value) => update('fullName', value)} required />
            <Field label="WhatsApp" value={form.phone} onChange={(value) => update('phone', value)} required />
            <Field label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} />
            <Field label="Ciudad" value={form.city} onChange={(value) => update('city', value)} required />
            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-forest">Dirección</span>
              <input className="mt-2 h-12 w-full rounded-md border border-gold/30 px-3 outline-none focus:border-terracotta" value={form.address} onChange={(event) => update('address', event.target.value)} required />
            </label>
            <label>
              <span className="text-sm font-semibold text-forest">Método de pago</span>
              <select className="mt-2 h-12 w-full rounded-md border border-gold/30 px-3 outline-none focus:border-terracotta" value={form.paymentMethod} onChange={(event) => update('paymentMethod', event.target.value)}>
                {paymentMethods.map((method) => <option key={method}>{method}</option>)}
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold text-forest">Notas del pedido</span>
              <input className="mt-2 h-12 w-full rounded-md border border-gold/30 px-3 outline-none focus:border-terracotta" value={form.notes} onChange={(event) => update('notes', event.target.value)} />
            </label>
          </div>
          {error && <p className="mt-5 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <Button disabled={loading} className="mt-7" type="submit">{loading ? 'Creando pedido...' : 'Finalizar pedido'}</Button>
        </form>
        <aside className="h-fit rounded-lg border border-gold/20 bg-ritual p-6">
          <h2 className="font-display text-3xl font-bold text-forest">Resumen</h2>
          <div className="mt-5 grid gap-4">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between gap-3 text-sm">
                <span>{item.quantity} x {item.name}</span>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-gold/20 pt-4">
            <span>Total parcial</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
        </aside>
      </div>
    </main>
  )
}

function Field({ label, type = 'text', value, onChange, required }) {
  return (
    <label>
      <span className="text-sm font-semibold text-forest">{label}</span>
      <input className="mt-2 h-12 w-full rounded-md border border-gold/30 px-3 outline-none focus:border-terracotta" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  )
}
