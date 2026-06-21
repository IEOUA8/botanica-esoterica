import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency } from '../../utils/format'

const paymentMethods = ['Transferencia bancaria', 'Nequi', 'Daviplata', 'Pago contra entrega', 'WhatsApp para confirmar']
const schema = z.object({
  fullName: z.string().trim().min(2, 'Escribe tu nombre completo.'),
  phone: z.string().trim().min(7, 'Escribe un número de contacto válido.').max(30),
  email: z.union([z.literal(''), z.email('Escribe un email válido.')]),
  city: z.string().trim().min(2, 'Escribe tu ciudad.'),
  address: z.string().trim().min(5, 'Escribe una dirección completa.'),
  paymentMethod: z.enum(paymentMethods),
  notes: z.string().trim().max(1000),
})

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.subtotal())
  const clearCart = useCartStore((state) => state.clearCart)
  const [submitError, setSubmitError] = useState('')
  const [idempotencyKey] = useState(() => crypto.randomUUID())
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', phone: '', email: '', city: '', address: '', paymentMethod: paymentMethods[0], notes: '' },
  })

  async function submit(form) {
    setSubmitError('')
    try {
      const { data } = await api.post('/orders', {
        customer: { fullName: form.fullName, phone: form.phone, email: form.email, city: form.city, address: form.address, notes: form.notes },
        paymentMethod: form.paymentMethod,
        items: items.map((item) => ({ product: item._id, quantity: item.quantity })),
      }, { headers: { 'Idempotency-Key': idempotencyKey } })
      clearCart()
      navigate('/confirmacion', { state: data })
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'No se pudo crear el pedido.')
    }
  }

  if (!items.length) return <main className="section-shell py-16"><div className="rounded-lg bg-ritual p-10 text-center"><p className="font-semibold text-forest">No hay productos para finalizar compra.</p><Button className="mt-5" to="/tienda">Volver a tienda</Button></div></main>

  return (
    <main className="bg-warm py-12">
      <div className="section-shell grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit(submit)} className="rounded-lg border border-gold/20 bg-white p-6 shadow-soft" noValidate>
          <h1 className="font-display text-5xl font-bold text-forest">Checkout sin registro</h1>
          <p className="mt-3 text-incense/80">Completa tus datos y confirmaremos la compra por WhatsApp o el método seleccionado.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <Field label="Nombre completo" error={errors.fullName?.message}><input autoComplete="name" {...register('fullName')} /></Field>
            <Field label="WhatsApp" error={errors.phone?.message}><input autoComplete="tel" {...register('phone')} /></Field>
            <Field label="Email" error={errors.email?.message}><input type="email" autoComplete="email" {...register('email')} /></Field>
            <Field label="Ciudad" error={errors.city?.message}><input autoComplete="address-level2" {...register('city')} /></Field>
            <Field className="md:col-span-2" label="Dirección" error={errors.address?.message}><input autoComplete="street-address" {...register('address')} /></Field>
            <Field label="Método de pago" error={errors.paymentMethod?.message}><select {...register('paymentMethod')}>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></Field>
            <Field label="Notas del pedido" error={errors.notes?.message}><input {...register('notes')} /></Field>
          </div>
          {submitError && <p className="mt-5 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700" role="alert">{submitError}</p>}
          <Button disabled={isSubmitting} className="mt-7" type="submit">{isSubmitting ? 'Creando pedido...' : 'Finalizar pedido'}</Button>
        </form>
        <aside className="h-fit rounded-lg border border-gold/20 bg-ritual p-6">
          <h2 className="font-display text-3xl font-bold text-forest">Resumen</h2>
          <div className="mt-5 grid gap-4">{items.map((item) => <div key={item._id} className="flex justify-between gap-3 text-sm"><span>{item.quantity} x {item.name}</span><strong>{formatCurrency(item.price * item.quantity)}</strong></div>)}</div>
          <div className="mt-5 flex justify-between border-t border-gold/20 pt-4"><span>Total parcial</span><strong>{formatCurrency(subtotal)}</strong></div>
        </aside>
      </div>
    </main>
  )
}

function Field({ label, error, className = '', children }) {
  return (
    <label className={className}>
      <span className="text-sm font-semibold text-forest">{label}</span>
      <span className="mt-2 block [&>input]:h-12 [&>input]:w-full [&>input]:rounded-md [&>input]:border [&>input]:border-gold/30 [&>input]:px-3 [&>select]:h-12 [&>select]:w-full [&>select]:rounded-md [&>select]:border [&>select]:border-gold/30 [&>select]:px-3">{children}</span>
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  )
}
