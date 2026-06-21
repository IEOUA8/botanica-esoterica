import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { WHATSAPP_NUMBER } from '../../services/api'
import { encodeWhatsapp } from '../../utils/format'

const pages = {
  '/sobre-nosotros': SobreNosotros,
  '/guia-espiritual': GuiaEspiritual,
  '/contacto': Contacto,
  '/politicas-envio': PoliticasEnvio,
  '/privacidad': Privacidad,
  '/terminos': Terminos,
}

export default function StaticPage({ path }) {
  const Page = pages[path] || SobreNosotros
  return <Page />
}

function PageShell({ tag, title, children }) {
  return (
    <main className="bg-warm py-16">
      <div className="section-shell max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-terracotta">{tag}</p>
        <h1 className="mt-3 font-display text-5xl font-bold text-forest">{title}</h1>
        {children}
      </div>
    </main>
  )
}

function SobreNosotros() {
  const values = [
    ['Selección con intención', 'Cada producto es elegido por sus propiedades simbólicas, su tradición y su energía ritual, no por tendencia.'],
    ['Respeto espiritual', 'Trabajamos con respeto por las tradiciones esotéricas, sin exageraciones ni promesas absolutas.'],
    ['Cercanía y confianza', 'Acompañamos a cada cliente con asesoría personalizada por WhatsApp antes, durante y después de cada compra.'],
    ['Calidad artesanal', 'Priorizamos productos naturales, artesanales y de origen consciente para garantizar una experiencia auténtica.'],
  ]

  return (
    <PageShell tag="Botánica Esotérica Internacional" title="Sobre nosotros">
      <p className="mt-6 text-lg leading-8 text-incense/85">
        Somos una tienda especializada en productos esotéricos, espirituales y rituales, creada para acompañar tu camino de intención, bienestar energético y conexión interior. Seleccionamos con cuidado cada elemento: velas rituales, sahumerios, hierbas espirituales, aceites, amuletos, minerales y kits de abundancia, amor, protección y prosperidad.
      </p>
      <p className="mt-4 text-lg leading-8 text-incense/85">
        Nuestra filosofía es sencilla: creemos que los elementos rituales acompañan tu intención, tu fe y tu disciplina espiritual. No prometemos resultados absolutos — acompañamos tu proceso con productos seleccionados, información clara y asesoría cercana.
      </p>

      <h2 className="mt-10 font-display text-3xl font-bold text-forest">Nuestros valores</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {values.map(([title, text]) => (
          <div key={title} className="rounded-lg border border-gold/20 bg-white p-5 shadow-soft">
            <h3 className="font-display text-xl font-bold text-forest">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-incense/80">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg bg-deep p-8 text-white">
        <p className="font-display text-2xl font-bold">Conecta con la energía que transforma tu camino.</p>
        <p className="mt-3 text-ritual/80">Escríbenos por WhatsApp para asesoría personalizada sobre productos, rituales e intenciones.</p>
        <a
          href={encodeWhatsapp(WHATSAPP_NUMBER, 'Hola, quiero asesoría sobre sus productos esotéricos.')}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 font-semibold text-white hover:opacity-90"
        >
          <MessageCircle size={18} /> Escríbenos por WhatsApp
        </a>
      </div>
    </PageShell>
  )
}

function GuiaEspiritual() {
  const steps = [
    ['1. Define tu intención', 'Antes de elegir cualquier producto, pregúntate qué deseas invocar: abundancia, amor, protección, salud, claridad o prosperidad. La intención es el motor de todo ritual.'],
    ['2. Elige el elemento ritual', 'Cada elemento tiene una función energética. Las velas trabajan el fuego y la manifestación. Las hierbas limpian y elevan. Los aceites sellan intenciones. Los minerales amplifican y protegen.'],
    ['3. Prepara tu espacio', 'Un espacio ordenado, limpio y cargado con tu energía multiplica el efecto del ritual. Usa sahumerios o inciensos para limpiar el ambiente antes de comenzar.'],
    ['4. Realiza tu práctica con presencia', 'El ritual vale por tu presencia y convicción. No necesitas conocer fórmulas exactas: habla desde tu corazón, pronuncia tu intención en voz alta y actúa con fe y gratitud.'],
  ]

  const elements = [
    ['Velas rituales', 'Cada color tiene una vibración: rojo para amor y pasión, verde para abundancia, blanco para pureza, negro para protección.'],
    ['Sahumerios e inciensos', 'Limpian el ambiente energético, elevan la vibración del espacio y acompañan la meditación y la oración.'],
    ['Hierbas espirituales', 'Cada hierba tiene un uso ritual específico: ruda para protección, canela para abundancia, lavanda para paz y amor.'],
    ['Aceites esotéricos', 'Se usan para ungir velas, amuletos y objetos personales, potenciando intenciones de amor, dinero y protección.'],
    ['Minerales y cuarzos', 'Los cristales amplifican energías, protegen espacios y equilibran el campo energético personal.'],
    ['Amuletos y talismanes', 'Elementos cargados con intención para atraer suerte, amor, dinero o protección espiritual continua.'],
  ]

  return (
    <PageShell tag="Botánica Esotérica Internacional" title="Guía espiritual">
      <p className="mt-6 text-lg leading-8 text-incense/85">
        Esta guía te acompaña en tu práctica ritual para que puedas elegir y usar tus productos con intención, respeto y consciencia. Recuerda que ningún producto promete resultados absolutos — acompañan tu energía, tu fe y tu disciplina espiritual.
      </p>

      <h2 className="mt-10 font-display text-3xl font-bold text-forest">Cómo realizar un ritual en 4 pasos</h2>
      <div className="mt-6 grid gap-5">
        {steps.map(([title, text]) => (
          <div key={title} className="rounded-lg border border-gold/20 bg-white p-6 shadow-soft">
            <h3 className="font-display text-xl font-bold text-forest">{title}</h3>
            <p className="mt-2 leading-7 text-incense/80">{text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-3xl font-bold text-forest">Guía de elementos rituales</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {elements.map(([title, text]) => (
          <div key={title} className="rounded-lg border border-gold/10 bg-ritual p-4">
            <h3 className="font-semibold text-forest">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-incense/80">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg bg-deep p-6 text-white">
        <p className="font-semibold">¿Necesitas orientación personalizada?</p>
        <p className="mt-2 text-sm text-ritual/80">Cuéntanos tu intención y te recomendamos los productos ideales para tu práctica.</p>
        <a
          href={encodeWhatsapp(WHATSAPP_NUMBER, 'Hola, quiero orientación espiritual para elegir productos rituales.')}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold hover:opacity-90"
        >
          <MessageCircle size={16} /> Consultar por WhatsApp
        </a>
      </div>
    </PageShell>
  )
}

function Contacto() {
  const waMsg = 'Hola, quiero información sobre sus productos esotéricos.'
  return (
    <PageShell tag="Botánica Esotérica Internacional" title="Contacto">
      <p className="mt-6 text-lg leading-8 text-incense/85">
        Estamos disponibles para asesorarte en la elección de productos, confirmar disponibilidad, coordinar envíos y atender pedidos especiales. La manera más rápida de comunicarte con nosotros es por WhatsApp.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-lg border border-gold/20 bg-white p-6 shadow-soft">
          <MessageCircle className="text-[#25D366]" size={28} />
          <h2 className="mt-3 font-display text-2xl font-bold text-forest">WhatsApp</h2>
          <p className="mt-2 text-sm text-incense/80">Respuesta rápida de lunes a sábado. La forma más directa para asesoría, pedidos y confirmaciones de pago.</p>
          <a
            href={encodeWhatsapp(WHATSAPP_NUMBER, waMsg)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-3 font-semibold text-white hover:opacity-90"
          >
            <MessageCircle size={18} /> Abrir WhatsApp
          </a>
        </div>

        <div className="rounded-lg border border-gold/20 bg-white p-6 shadow-soft">
          <Mail className="text-terracotta" size={28} />
          <h2 className="mt-3 font-display text-2xl font-bold text-forest">Correo electrónico</h2>
          <p className="mt-2 text-sm text-incense/80">Para consultas formales, pedidos al por mayor o colaboraciones de negocio.</p>
          <p className="mt-4 font-semibold text-forest">hola@botanicaesoterica.com</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-lg border border-gold/20 bg-white p-6 shadow-soft">
          <Phone className="text-terracotta" size={28} />
          <h2 className="mt-3 font-display text-2xl font-bold text-forest">Horario de atención</h2>
          <ul className="mt-3 space-y-2 text-sm text-incense/80">
            <li className="flex justify-between"><span>Lunes a viernes</span><strong>9:00 AM – 6:00 PM</strong></li>
            <li className="flex justify-between"><span>Sábados</span><strong>10:00 AM – 2:00 PM</strong></li>
            <li className="flex justify-between"><span>Domingos</span><strong>Cerrado</strong></li>
          </ul>
        </div>

        <div className="rounded-lg border border-gold/20 bg-white p-6 shadow-soft">
          <MapPin className="text-terracotta" size={28} />
          <h2 className="mt-3 font-display text-2xl font-bold text-forest">Cobertura de envíos</h2>
          <p className="mt-2 text-sm leading-6 text-incense/80">Realizamos envíos a todo Colombia y envíos internacionales a solicitud. Los tiempos y costos se confirman según la ciudad y el transportador disponible.</p>
        </div>
      </div>
    </PageShell>
  )
}

function PoliticasEnvio() {
  const items = [
    ['Tiempo de preparación', 'Los pedidos se preparan en 1 a 2 días hábiles después de confirmar el pago.'],
    ['Tiempo de entrega', 'Ciudades principales: 2 a 4 días hábiles. Ciudades intermedias: 3 a 7 días hábiles. Zonas rurales: 5 a 10 días hábiles.'],
    ['Costo de envío', 'El costo de envío se informa al confirmar el pedido por WhatsApp, según ciudad y peso del paquete.'],
    ['Seguimiento', 'Una vez despachado el pedido, te enviamos el número de guía por WhatsApp para que puedas hacer seguimiento.'],
    ['Paquetes dañados', 'Si el paquete llega con daños visibles, debes documentarlo con fotos y notificarnos en las primeras 24 horas después de recibido.'],
    ['Dirección incorrecta', 'Verifica siempre tu dirección en el checkout. No nos hacemos responsables por demoras o pérdidas causadas por datos incorrectos.'],
  ]

  return (
    <PageShell tag="Botánica Esotérica Internacional" title="Políticas de envío">
      <p className="mt-6 text-lg leading-8 text-incense/85">
        Queremos que tu pedido llegue en perfectas condiciones y en el menor tiempo posible. Lee nuestras políticas de envío para entender los tiempos, costos y condiciones de despacho.
      </p>
      <div className="mt-8 grid gap-4">
        {items.map(([title, text]) => (
          <div key={title} className="rounded-lg border border-gold/20 bg-white p-5 shadow-soft">
            <h3 className="font-semibold text-forest">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-incense/80">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-incense/60">
        Para más información sobre tu pedido, escríbenos por{' '}
        <a href={encodeWhatsapp(WHATSAPP_NUMBER, 'Hola, tengo una consulta sobre envíos.')} target="_blank" rel="noreferrer" className="font-semibold text-terracotta hover:underline">WhatsApp</a>.
      </p>
    </PageShell>
  )
}

function Privacidad() {
  return (
    <PageShell tag="Botánica Esotérica Internacional" title="Políticas de privacidad">
      <p className="mt-6 text-lg leading-8 text-incense/85">
        En Botánica Esotérica Internacional respetamos tu privacidad y el uso responsable de tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos la información que nos proporcionas al realizar un pedido.
      </p>

      <div className="mt-8 space-y-6">
        <Section title="¿Qué información recopilamos?">
          Recopilamos los datos que proporcionas al hacer un pedido: nombre completo, número de WhatsApp, correo electrónico, ciudad y dirección de entrega. No solicitamos información adicional innecesaria.
        </Section>
        <Section title="¿Para qué usamos tus datos?">
          Usamos tu información exclusivamente para gestionar y coordinar tu pedido, contactarte para confirmar pago y despacho, enviarte la información de seguimiento de tu paquete, y atender consultas relacionadas con tu compra.
        </Section>
        <Section title="¿Compartimos tus datos?">
          No vendemos, alquilamos ni compartimos tus datos con terceros con fines comerciales. Solo compartimos información estrictamente necesaria con el transportador para gestionar el despacho de tu pedido.
        </Section>
        <Section title="¿Cómo protegemos tus datos?">
          Mantenemos medidas técnicas y organizativas para proteger tu información. Los datos sensibles como contraseñas o información de pago no son almacenados por nosotros.
        </Section>
        <Section title="Tus derechos">
          Puedes solicitar en cualquier momento acceso, corrección o eliminación de tus datos personales escribiéndonos por WhatsApp o al correo electrónico de contacto.
        </Section>
      </div>
    </PageShell>
  )
}

function Terminos() {
  return (
    <PageShell tag="Botánica Esotérica Internacional" title="Términos y condiciones">
      <p className="mt-6 text-lg leading-8 text-incense/85">
        Al realizar una compra en Botánica Esotérica Internacional aceptas los siguientes términos y condiciones. Te pedimos leerlos con atención.
      </p>

      <div className="mt-8 space-y-6">
        <Section title="Naturaleza de los productos">
          Todos los productos ofrecidos en nuestra tienda son de uso espiritual, ritual y simbólico. No sustituyen tratamiento médico, psicológico, legal o financiero profesional. Los resultados dependen de la intención, fe y práctica personal de cada usuario.
        </Section>
        <Section title="Proceso de compra">
          Al completar el checkout, el pedido queda registrado como pendiente de confirmación. El pedido se confirma una vez verificado el pago a través de WhatsApp u otros medios acordados.
        </Section>
        <Section title="Pagos">
          Aceptamos transferencia bancaria, Nequi, Daviplata y pago contra entrega según disponibilidad. El pedido se despacha únicamente después de confirmar el pago.
        </Section>
        <Section title="Cambios y devoluciones">
          Aceptamos cambios dentro de los primeros 5 días hábiles posteriores a la entrega, siempre que el producto no haya sido usado y conserve su empaque original. No aceptamos devoluciones de productos de uso íntimo o ritual una vez abiertos.
        </Section>
        <Section title="Responsabilidad">
          Botánica Esotérica Internacional no se responsabiliza por los resultados del uso ritual de los productos. La responsabilidad de uso corresponde exclusivamente al comprador.
        </Section>
        <Section title="Modificaciones">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se publican en esta página y aplican desde la fecha de publicación.
        </Section>
      </div>
    </PageShell>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-white p-5 shadow-soft">
      <h3 className="font-display text-xl font-bold text-forest">{title}</h3>
      <p className="mt-2 leading-7 text-incense/80">{children}</p>
    </div>
  )
}
