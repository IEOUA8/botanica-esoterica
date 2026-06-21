import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency } from '../../utils/format'

export default function Cart() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const subtotal = useCartStore((state) => state.subtotal())

  return (
    <main className="bg-warm py-12">
      <div className="section-shell">
        <h1 className="font-display text-5xl font-bold text-forest">Carrito</h1>
        {!items.length ? (
          <div className="mt-8 rounded-lg bg-ritual p-10 text-center">
            <p className="font-semibold text-forest">Tu carrito está vacío.</p>
            <Button className="mt-5" to="/tienda">Explorar productos</Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-4">
              {items.map((item) => (
                <article key={item._id} className="grid gap-4 rounded-lg border border-gold/20 bg-white p-4 shadow-soft sm:grid-cols-[120px_1fr_auto] sm:items-center">
                  <img className="aspect-square rounded-md object-cover" src={item.image} alt={item.name} />
                  <div>
                    <Link to={`/producto/${item.slug}`} className="font-display text-2xl font-bold text-forest">{item.name}</Link>
                    <p className="mt-1 font-semibold text-terracotta">{formatCurrency(item.price)}</p>
                    <input
                      className="mt-3 h-10 w-24 rounded-md border border-gold/30 px-3"
                      type="number"
                      min="1"
                      max={item.stock || 99}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item._id, Number(event.target.value))}
                    />
                  </div>
                  <button className="rounded-md p-2 text-terracotta hover:bg-terracotta/10" aria-label="Eliminar producto" onClick={() => removeItem(item._id)}>
                    <Trash2 />
                  </button>
                </article>
              ))}
            </div>
            <aside className="h-fit rounded-lg border border-gold/20 bg-ritual p-6">
              <h2 className="font-display text-3xl font-bold text-forest">Resumen</h2>
              <div className="mt-5 flex justify-between border-b border-gold/20 pb-4">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <p className="mt-4 text-sm leading-6 text-incense/80">El envío se confirma manualmente según ciudad y dirección.</p>
              <Button className="mt-6 w-full" to="/checkout">Continuar compra</Button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
