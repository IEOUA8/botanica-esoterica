import { Camera, Mail, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-deep text-ritual">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Botánica Esotérica Internacional</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-ritual/80">
            Productos espirituales para rituales, intención y conexión energética. Cada elemento acompaña tu práctica con respeto, simbolismo y propósito.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Enlaces</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-ritual/80">
            <Link to="/tienda">Tienda</Link>
            <Link to="/guia-espiritual">Guía espiritual</Link>
            <Link to="/politicas-envio">Políticas de envío</Link>
            <Link to="/terminos">Términos</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white">Categorías</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-ritual/80">
            <Link to="/tienda?category=dinero-y-prosperidad">Abundancia</Link>
            <Link to="/tienda?category=amor-y-atraccion">Amor</Link>
            <Link to="/tienda?category=proteccion-espiritual">Protección</Link>
            <Link to="/tienda?category=limpieza-y-descarga">Limpieza</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white">Contacto</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-ritual/80">
            <span className="flex items-center gap-2"><MessageCircle size={17} /> WhatsApp</span>
            <span className="flex items-center gap-2"><Camera size={17} /> Instagram</span>
            <span className="flex items-center gap-2"><Mail size={17} /> hola@botanica.test</span>
            <span className="flex items-center gap-2"><MapPin size={17} /> Envíos nacionales e internacionales</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
