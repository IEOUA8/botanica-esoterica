import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react'
import Button from './Button'

export function LoadingState({ message = 'Cargando información...' }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-ritual p-10 text-center" role="status" aria-live="polite">
      <LoaderCircle className="mx-auto animate-spin text-terracotta" />
      <p className="mt-3 font-semibold text-forest">{message}</p>
    </div>
  )
}

export function ErrorState({ message = 'No pudimos cargar la información.', onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-10 text-center" role="alert">
      <AlertTriangle className="mx-auto text-red-700" />
      <p className="mt-3 font-semibold text-red-800">{message}</p>
      {onRetry && <Button className="mt-5" type="button" onClick={onRetry}>Intentar de nuevo</Button>}
    </div>
  )
}

export function EmptyState({ message, children }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-ritual p-10 text-center">
      <Inbox className="mx-auto text-terracotta" />
      <p className="mt-3 font-semibold text-forest">{message}</p>
      {children}
    </div>
  )
}

