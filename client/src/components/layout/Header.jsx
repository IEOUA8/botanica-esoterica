import { Link, NavLink } from 'react-router-dom'
import { Menu, MessageCircle, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useSearchStore } from '../../store/searchStore'
import { WHATSAPP_NUMBER } from '../../services/api'
import Logo from '../ui/Logo'

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
  const openSearch = useSearchStore((state) => state.openSearch)

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-warm/95 backdrop-blur-md">
      <div className="section-shell flex min-h-[68px] items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5 leading-none">
          <Logo className="text-forest" size={34} />
          <div className="flex flex-col leading-[1.1]">
            <span className="font-display text-[1.3rem] font-bold text-forest">Botánica</span>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-gold">
              Esotérica Internacional
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? 'text-forest' : 'text-deep/65 hover:text-forest'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          {/* Search */}
          <button
            aria-label="Buscar"
            onClick={openSearch}
            className="rounded-lg p-2.5 text-deep/55 transition hover:bg-ritual hover:text-forest"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Cart */}
          <Link
            aria-label="Carrito"
            to="/carrito"
            className="relative rounded-lg p-2.5 text-deep/55 transition hover:bg-ritual hover:text-forest"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-terracotta text-[10px] font-bold leading-none text-white">
                {count}
              </span>
            )}
          </Link>

          {/* WhatsApp desktop */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="ml-1 hidden items-center gap-2 rounded-lg border border-forest/20 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-forest hover:text-white lg:flex"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>

          {/* Mobile menu toggle */}
          <button
            className="rounded-lg p-2.5 text-deep/55 transition hover:bg-ritual lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-gold/15 bg-warm px-4 py-3 lg:hidden">
          <div className="flex flex-col">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-ritual text-forest' : 'text-deep hover:bg-ritual'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-2 rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-ritual"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
