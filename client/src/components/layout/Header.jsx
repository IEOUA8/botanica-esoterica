import { Link, NavLink } from 'react-router-dom'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import Button from '../ui/Button'
import { WHATSAPP_NUMBER } from '../../services/api'

const links = [
  ['Inicio', '/'],
  ['Tienda', '/tienda'],
  ['Rituales', '/guia-espiritual'],
  ['Sobre nosotros', '/sobre-nosotros'],
  ['Contacto', '/contacto'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const count = useCartStore((state) => state.count())

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-warm/95 backdrop-blur">
      <div className="section-shell flex min-h-20 items-center justify-between gap-4">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl font-bold text-forest">Botánica</span>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">Esotérica Internacional</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? 'text-terracotta' : 'text-deep hover:text-terracotta'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link aria-label="Buscar productos" to="/tienda" className="rounded-md p-2 text-deep hover:bg-ritual">
            <Search size={20} />
          </Link>
          <Link aria-label="Carrito" to="/carrito" className="relative rounded-md p-2 text-deep hover:bg-ritual">
            <ShoppingBag size={21} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-terracotta text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Button className="hidden lg:inline-flex" variant="secondary" href={`https://wa.me/${WHATSAPP_NUMBER}`}>
            WhatsApp
          </Button>
          <button
            className="rounded-md p-2 text-deep hover:bg-ritual lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gold/20 bg-warm px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map(([label, to]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold text-deep hover:bg-ritual">
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
