import { X } from 'lucide-react'
import { useState } from 'react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="relative bg-forest px-10 py-2.5 text-center text-sm font-medium text-ritual/90">
      ✦ Envíos nacionales e internacionales &nbsp;·&nbsp; Asesoría personalizada por WhatsApp
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-0.5 text-ritual/50 transition hover:text-ritual"
        onClick={() => setVisible(false)}
        aria-label="Cerrar anuncio"
      >
        <X size={14} />
      </button>
    </div>
  )
}
