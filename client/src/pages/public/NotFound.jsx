import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../../components/ui/Logo'
import Button from '../../components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex min-h-[72vh] items-center justify-center py-20">
      <div className="text-center">
        <Logo className="mx-auto text-forest/20" size={64} />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-gold">Error 404</p>
        <h1 className="mt-3 font-display text-6xl font-bold text-forest lg:text-7xl">
          Página no encontrada
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-incense/60">
          Esta página no existe o fue movida. Explora nuestra tienda para encontrar el elemento espiritual que buscas.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/tienda">
            Ir a la tienda <ArrowRight size={16} />
          </Button>
          <Button variant="outline" to="/">
            Inicio
          </Button>
        </div>
      </div>
    </main>
  )
}
