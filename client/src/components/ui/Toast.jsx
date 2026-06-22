import { X, ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useToastStore } from '../../store/toastStore'
import { formatCurrency } from '../../utils/format'

function ToastItem({ toast }) {
  const removeToast = useToastStore((state) => state.removeToast)

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 4500)
    return () => clearTimeout(timer)
  }, [toast.id, removeToast])

  return (
    <motion.div
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex w-80 items-start gap-3 overflow-hidden rounded-xl bg-white p-4 shadow-soft"
    >
      {/* Icon */}
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50">
        <ShoppingBag className="text-emerald-600" size={17} />
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
          Agregado al carrito
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-deep">
          {toast.product.name}
        </p>
        <p className="text-xs text-incense/55">{formatCurrency(toast.product.price)}</p>
        <Link
          to="/carrito"
          onClick={() => removeToast(toast.id)}
          className="mt-1.5 inline-block text-xs font-bold text-forest hover:underline"
        >
          Ver carrito →
        </Link>
      </div>

      {/* Close */}
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 rounded p-0.5 text-incense/40 transition hover:text-deep"
        aria-label="Cerrar notificación"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  return (
    <div className="fixed bottom-6 right-4 z-[70] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
