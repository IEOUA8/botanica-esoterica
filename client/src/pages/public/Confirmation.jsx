import { CheckCircle2, MessageCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { WHATSAPP_NUMBER } from '../../services/api'
import { encodeWhatsapp, formatCurrency } from '../../utils/format'

export default function Confirmation() {
  const { state } = useLocation()
  const order = state?.order
  const message = state?.whatsappMessage || ''

  return (
    <main className="bg-warm py-16">
      <div className="section-shell max-w-3xl rounded-lg border border-gold/20 bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto text-terracotta" size={54} />
        <h1 className="mt-5 font-display text-5xl font-bold text-forest">Pedido recibido</h1>
        {order ? (
          <>
            <p className="mt-3 text-incense/80">Tu pedido {order.orderNumber} quedó registrado. Te contactaremos para confirmar pago y despacho.</p>
            <div className="mx-auto mt-6 max-w-md rounded-lg bg-ritual p-5 text-left">
              <div className="flex justify-between"><span>Total</span><strong>{formatCurrency(order.total)}</strong></div>
              <div className="mt-2 flex justify-between"><span>Estado</span><strong>{order.orderStatus}</strong></div>
            </div>
            <Button className="mt-7" href={encodeWhatsapp(WHATSAPP_NUMBER, message)}><MessageCircle size={18} /> Confirmar por WhatsApp</Button>
          </>
        ) : (
          <>
            <p className="mt-3 text-incense/80">No hay un pedido reciente en esta vista.</p>
            <Button className="mt-7" to="/tienda">Volver a tienda</Button>
          </>
        )}
        <Link className="mt-5 block text-sm font-semibold text-terracotta" to="/">Ir al inicio</Link>
      </div>
    </main>
  )
}
