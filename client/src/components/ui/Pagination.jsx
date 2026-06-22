import Button from './Button'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Paginación del catálogo">
      <Button variant="outline" type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</Button>
      <span className="text-sm font-semibold text-forest" aria-live="polite">Página {page} de {totalPages}</span>
      <Button variant="outline" type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente</Button>
    </nav>
  )
}

