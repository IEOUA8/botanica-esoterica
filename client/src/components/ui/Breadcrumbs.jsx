import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link to="/" className="text-incense/50 transition hover:text-terracotta" aria-label="Inicio">
        <Home size={14} />
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRight size={13} className="shrink-0 text-incense/30" />
          {item.href ? (
            <Link to={item.href} className="text-incense/50 transition hover:text-terracotta">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-deep">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
