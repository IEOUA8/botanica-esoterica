const content = {
  '/sobre-nosotros': ['Sobre nosotros', 'Seleccionamos productos espirituales con una mirada cálida, respetuosa y artesanal para acompañar rituales personales de intención, protección, abundancia y conexión interior.'],
  '/guia-espiritual': ['Guía espiritual', 'Define tu intención, elige un elemento ritual, prepara tu espacio y realiza tu práctica con presencia. Ningún producto promete resultados absolutos; acompaña tu proceso simbólico y espiritual.'],
  '/contacto': ['Contacto', 'Escríbenos por WhatsApp para asesoría, disponibilidad de productos, envíos y pedidos especiales.'],
  '/politicas-envio': ['Políticas de envío', 'Los tiempos y costos de envío se confirman según ciudad, dirección y disponibilidad logística. El pedido queda pendiente hasta confirmar pago y despacho.'],
  '/privacidad': ['Políticas de privacidad', 'Usamos tus datos únicamente para gestionar pedidos, contacto comercial autorizado y coordinación de despacho.'],
  '/terminos': ['Términos y condiciones', 'Los productos son de uso espiritual, ritual y simbólico. No sustituyen atención médica, psicológica, legal o financiera profesional.'],
}

export default function StaticPage({ path }) {
  const [title, text] = content[path] || content['/sobre-nosotros']
  return (
    <main className="bg-warm py-16">
      <div className="section-shell max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">Botánica Esotérica Internacional</p>
        <h1 className="mt-3 font-display text-5xl font-bold text-forest">{title}</h1>
        <p className="mt-6 text-lg leading-8 text-incense/85">{text}</p>
      </div>
    </main>
  )
}
