import { AlertTriangle, Inbox } from 'lucide-react'
import Button from './Button'

export function LoadingState({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-forest/30"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm font-medium text-incense/50">{message}</p>
    </div>
  )
}

export function ErrorState({ message = 'No pudimos cargar la información.', onRetry }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-10 text-center" role="alert">
      <AlertTriangle className="mx-auto text-red-400" size={28} />
      <p className="mt-3 font-semibold text-red-800">{message}</p>
      {onRetry && (
        <Button className="mt-5" type="button" onClick={onRetry}>
          Intentar de nuevo
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ message, children }) {
  return (
    <div className="rounded-xl border border-gold/15 bg-ritual/60 p-14 text-center">
      <Inbox className="mx-auto text-forest/25" size={36} />
      <p className="mt-4 font-semibold text-forest">{message}</p>
      {children}
    </div>
  )
}
