import { Camera, Mail, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WHATSAPP_NUMBER } from '../../services/api'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-deep text-ritual">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-forest text-gold text-[17px]">
              ✦
            </span>
            <h2 className="font-display text-2xl font-bold text-white">Botánica Esotérica</h2>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-ritual/70">
            Productos espirituales para rituales, intención y conexión energética. Cada elemento acompaña tu práctica con respeto, simbolismo y propósito.
          </p>
          {/* Social icons */}
          <div className="mt-5 flex gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="grid size-9 place-items-center rounded-full border border-ritual/20 text-ritual/60 transition hover:border-gold/40 hover:text-gold"
            >
              <MessageCircle size={17} />
            </a>
            <a
              href="#"
              aria-label="Camera"
              className="grid size-9 place-items-center rounded-full border border-ritual/20 text-ritual/60 transition hover:border-gold/40 hover:text-gold"
            >
              <Camera size={17} />
            </a>
            <a
              href="mailto:hola@botanica.test"
              aria-label="Email"
              className="grid size-9 place-items-center rounded-full border border-ritual/20 text-ritual/60 transition hover:border-gold/40 hover:text-gold"
            >
              <Mail size={17} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/80">
            Páginas
          </h3>
          <div className="flex flex-col gap-2.5 text-sm text-ritual/65">
            <Link to="/tienda" className="transition hover:text-gold">Tienda</Link>
            <Link to="/guia-espiritual" className="transition hover:text-gold">Guía espiritual</Link>
            <Link to="/sobre-nosotros" className="transition hover:text-gold">Sobre nosotros</Link>
            <Link to="/politicas-envio" className="transition hover:text-gold">Políticas de envío</Link>
            <Link to="/terminos" className="transition hover:text-gold">Términos</Link>
            <Link to="/privacidad" className="transition hover:text-gold">Privacidad</Link>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/80">
            Categorías
          </h3>
          <div className="flex flex-col gap-2.5 text-sm text-ritual/65">
            <Link to="/tienda?category=dinero-y-prosperidad" className="transition hover:text-gold">Abundancia</Link>
            <Link to="/tienda?category=amor-y-atraccion" className="transition hover:text-gold">Amor</Link>
            <Link to="/tienda?category=proteccion-espiritual" className="transition hover:text-gold">Protección</Link>
            <Link to="/tienda?category=limpieza-y-descarga" className="transition hover:text-gold">Limpieza</Link>
            <Link to="/tienda?category=kits-rituales" className="transition hover:text-gold">Kits rituales</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/80">
            Contacto
          </h3>
          <div className="flex flex-col gap-3 text-sm text-ritual/65">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition hover:text-gold"
            >
              <MessageCircle size={15} className="shrink-0" />
              WhatsApp
            </a>
            <a href="#" className="flex items-center gap-2 transition hover:text-gold">
              <Camera size={15} className="shrink-0" />
              Camera
            </a>
            <a
              href="mailto:hola@botanica.test"
              className="flex items-center gap-2 transition hover:text-gold"
            >
              <Mail size={15} className="shrink-0" />
              hola@botanica.test
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0" />
              Envíos nacionales e internacionales
            </span>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-ritual/10">
        <div className="section-shell flex flex-col items-center justify-between gap-2 py-5 text-xs text-ritual/40 sm:flex-row">
          <span>© {currentYear} Botánica Esotérica Internacional. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <Link to="/privacidad" className="transition hover:text-ritual/70">Privacidad</Link>
            <Link to="/terminos" className="transition hover:text-ritual/70">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
