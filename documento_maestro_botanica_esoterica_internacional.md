# Documento Maestro de Desarrollo
# Botánica Esotérica Internacional

## 1. Visión del proyecto

**Botánica Esotérica Internacional** será una tienda online especializada en productos esotéricos, espirituales y rituales enfocados en intención, bienestar energético y manifestación: suerte, abundancia, amor, dinero, salud, protección, limpieza, prosperidad y equilibrio espiritual.

El proyecto debe desarrollarse como una aplicación web full stack moderna, profesional, responsiva y escalable, con dos grandes módulos:

1. **Ecommerce público**: experiencia de compra abierta, sin obligación de registro.
2. **Panel administrador privado**: gestión completa de inventario, productos, ventas y despacho.

La tienda debe permitir que cualquier usuario explore productos, agregue al carrito, complete datos de compra y realice el pedido sin crear cuenta.

---

## 2. Objetivo principal

Crear una tienda online premium para vender productos esotéricos con una experiencia visual cálida, mística, elegante y confiable, inspirada en la estructura visual de la referencia adjunta: home con hero principal, categorías destacadas, grilla de productos, secciones promocionales, contenido educativo/comercial, galería visual y footer completo.

El sistema debe facilitar la administración interna del negocio mediante un panel profesional donde el administrador pueda crear, editar, activar/desactivar productos, revisar inventario, gestionar productos vendidos y controlar pedidos pendientes de despacho.

---

## 3. Identidad conceptual de marca

### Nombre

**Botánica Esotérica Internacional**

### Personalidad de marca

- Mística
- Espiritual
- Elegante
- Confiable
- Cálida
- Sagrada
- Artesanal
- Internacional
- Premium
- Cercana

### Promesa de marca

Productos esotéricos seleccionados para acompañar rituales de intención, protección, abundancia, amor, salud y prosperidad espiritual.

### Frase guía

**Conecta con la energía que transforma tu camino.**

### Tono de comunicación

Debe ser espiritual, claro, persuasivo y confiable. Evitar exageraciones absolutas como “garantiza resultados” o “cura enfermedades”. Usar lenguaje enfocado en intención, tradición, acompañamiento energético y bienestar espiritual.

Ejemplos de tono:

- “Rituales para abrir caminos de abundancia.”
- “Elementos espirituales para intencionar amor, protección y prosperidad.”
- “Productos seleccionados para acompañar tus prácticas energéticas.”

---

## 4. Referencia visual del diseño

La estructura visual debe inspirarse en la imagen adjunta de ecommerce, adaptando el concepto vegetal a una estética esotérica premium.

### Elementos que se deben conservar de la referencia

- Layout vertical tipo landing ecommerce.
- Hero principal con imagen de producto destacado.
- Header superior con navegación simple.
- Categorías destacadas en cards.
- Sección “Nuestros productos”.
- Filtros por categoría.
- Grilla de productos.
- Banner promocional intermedio.
- Sección educativa o de beneficios.
- Galería visual tipo Instagram.
- Footer completo con contacto, enlaces y suscripción.
- Versión mobile muy cuidada.

### Adaptación estética

Cambiar el universo visual de plantas decorativas por botánica esotérica:

- Velas rituales
- Sahumerios
- Inciensos
- Hierbas espirituales
- Aceites esotéricos
- Baños de descarga
- Amuletos
- Minerales
- Kits de amor
- Kits de abundancia
- Kits de protección
- Productos para limpieza energética

---

## 5. Paleta visual recomendada

### Colores principales

- Verde oscuro espiritual: `#063D2E`
- Verde profundo: `#0B2F24`
- Crema ritual: `#F4EFE3`
- Dorado suave: `#C8A24A`
- Terracota místico: `#B84812`
- Marrón incienso: `#5B3521`
- Blanco cálido: `#FFFDF7`

### Uso sugerido

- Fondo principal: crema ritual o blanco cálido.
- Header y banners: verde oscuro espiritual.
- Botones principales: terracota o dorado.
- Detalles premium: dorado suave.
- Textos principales: verde profundo o marrón oscuro.

---

## 6. Tipografía sugerida

### Opción recomendada

- Títulos: `Cormorant Garamond`, `Playfair Display` o `Cinzel`.
- Texto general: `Inter`, `Lato` o `Montserrat`.

### Estilo tipográfico

- Títulos elegantes, místicos y editoriales.
- Texto de producto limpio, comercial y legible.
- Botones claros y directos.

---

## 7. Arquitectura general del sistema

## 7.1 Frontend público

Páginas principales:

1. Home
2. Tienda / Catálogo
3. Detalle de producto
4. Carrito
5. Checkout sin registro
6. Confirmación de pedido
7. Sobre nosotros
8. Guía espiritual / Blog
9. Contacto
10. Políticas de envío
11. Políticas de privacidad
12. Términos y condiciones

## 7.2 Panel administrador

Rutas privadas con login:

1. Login administrador
2. Dashboard principal
3. Gestión de productos
4. Crear producto
5. Editar producto
6. Gestión de categorías
7. Inventario
8. Pedidos / productos vendidos
9. Detalle de pedido
10. Pedidos pendientes de despacho
11. Pedidos despachados
12. Clientes compradores
13. Configuración de tienda
14. Gestión de banners/promociones
15. Cerrar sesión

---

## 8. Stack tecnológico recomendado

### Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Zustand o Context API para carrito
- React Hook Form
- Zod para validaciones
- Axios o Fetch API
- Lucide React para iconos
- Framer Motion para animaciones sutiles

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT para autenticación admin
- Bcrypt para contraseña admin
- Multer o Cloudinary para imágenes
- Dotenv para variables de entorno

### Alternativa recomendada para imágenes

- Cloudinary para almacenamiento de imágenes de productos.

### Pasarela de pagos

Primera fase:

- Checkout con pedido manual vía WhatsApp o transferencia.

Segunda fase:

- Wompi, Mercado Pago, PayU o Stripe, según país objetivo.

---

## 9. Estructura de carpetas recomendada

```txt
botanica-esoterica-internacional/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   ├── product/
│   │   │   ├── cart/
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   └── admin/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── README.md
└── DOCUMENTO-MAESTRO.md
```

---

## 10. Modelo de datos

## 10.1 Producto

```js
{
  name: String,
  slug: String,
  description: String,
  shortDescription: String,
  category: ObjectId,
  intention: String,
  price: Number,
  compareAtPrice: Number,
  stock: Number,
  sku: String,
  images: [String],
  mainImage: String,
  tags: [String],
  ingredients: [String],
  ritualUse: String,
  warnings: String,
  isFeatured: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 10.2 Categoría

```js
{
  name: String,
  slug: String,
  description: String,
  image: String,
  isActive: Boolean,
  order: Number
}
```

## 10.3 Pedido

```js
{
  orderNumber: String,
  customer: {
    fullName: String,
    phone: String,
    email: String,
    city: String,
    address: String,
    notes: String
  },
  items: [
    {
      product: ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      image: String
    }
  ],
  subtotal: Number,
  shippingCost: Number,
  total: Number,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  shippingStatus: String,
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 10.4 Usuario administrador

```js
{
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  createdAt: Date
}
```

---

## 11. Categorías comerciales iniciales

1. Suerte y abre caminos
2. Amor y atracción
3. Dinero y prosperidad
4. Salud y bienestar energético
5. Protección espiritual
6. Limpieza y descarga
7. Velas rituales
8. Sahumerios e inciensos
9. Aceites y esencias
10. Baños espirituales
11. Amuletos y talismanes
12. Kits rituales

---

## 12. Estructura de la Home

## 12.1 Header

Elementos:

- Logo
- Inicio
- Tienda
- Rituales
- Sobre nosotros
- Contacto
- Icono de búsqueda
- Icono de carrito
- Botón WhatsApp

Header fijo o sticky en escritorio y mobile.

## 12.2 Hero principal

Contenido sugerido:

Título:

**Botánica esotérica para transformar tu energía**

Subtítulo:

Productos rituales, amuletos, velas, hierbas y elementos espirituales para intencionar amor, abundancia, protección, salud y prosperidad.

Botones:

- Comprar ahora
- Ver kits rituales

Visual:

Producto destacado con composición mística: vela, hierbas, cuarzos, humo de incienso, fondo verde oscuro y detalles dorados.

## 12.3 Beneficios rápidos

Tres o cuatro cards:

- Compra sin registrarte
- Productos seleccionados con intención
- Envíos nacionales/internacionales
- Asesoría por WhatsApp

## 12.4 Categorías destacadas

Cards inspiradas en el diseño de referencia:

- Abundancia
- Amor
- Protección
- Limpieza energética

## 12.5 Nuestros productos

Grilla con filtros:

- Más vendidos
- Nuevos
- Abundancia
- Amor
- Protección
- Limpieza

Cada producto debe mostrar:

- Imagen
- Nombre
- Precio
- Categoría o intención
- Botón “Agregar al carrito”
- Botón “Ver detalle”

## 12.6 Banner promocional

Texto:

**Rituales para abrir caminos de prosperidad**

Subtexto:

Encuentra kits preparados para acompañar tus intenciones de abundancia, claridad, amor y protección espiritual.

CTA:

**Explorar kits**

## 12.7 Sección educativa

Título:

**Cómo elegir tu producto espiritual**

Cards:

1. Define tu intención
2. Elige el elemento ritual
3. Prepara tu espacio
4. Realiza tu práctica con respeto

## 12.8 Bloque de contenido emocional

Título:

**Cada elemento tiene una intención**

Texto:

En Botánica Esotérica Internacional seleccionamos productos que acompañan prácticas espirituales, rituales personales y procesos de conexión interior. Nuestros productos no prometen resultados absolutos; acompañan tu intención, tu fe y tu disciplina espiritual.

## 12.9 Galería visual

Sección tipo Instagram:

- Fotografías de productos
- Altares
- Velas encendidas
- Hierbas
- Packs rituales
- Empaques

## 12.10 Newsletter / WhatsApp

Texto:

**Recibe rituales, novedades y ofertas especiales**

Campos:

- Nombre
- Email o WhatsApp

## 12.11 Footer

Contenido:

- Logo
- Descripción corta
- Enlaces rápidos
- Categorías
- Contacto
- WhatsApp
- Instagram
- Facebook
- TikTok
- Políticas
- Métodos de pago

---

## 13. Página de catálogo

Funcionalidades:

- Listado de productos.
- Filtro por categoría.
- Filtro por intención.
- Filtro por precio.
- Ordenar por más reciente, menor precio, mayor precio, más vendido.
- Buscador.
- Paginación o carga progresiva.

---

## 14. Detalle de producto

Debe incluir:

- Galería de imágenes.
- Nombre del producto.
- Precio.
- Stock disponible.
- Categoría.
- Intención espiritual.
- Descripción.
- Modo de uso ritual.
- Ingredientes o composición, si aplica.
- Advertencias.
- Selector de cantidad.
- Botón agregar al carrito.
- Botón comprar por WhatsApp.
- Productos relacionados.

Texto legal recomendado:

**Este producto es de uso espiritual, ritual y simbólico. No sustituye tratamiento médico, psicológico, legal o financiero profesional.**

---

## 15. Carrito

Funciones:

- Ver productos agregados.
- Modificar cantidades.
- Eliminar productos.
- Calcular subtotal.
- Calcular envío manual o fijo.
- Botón continuar compra.

---

## 16. Checkout sin registro

El usuario no debe registrarse.

Campos obligatorios:

- Nombre completo
- WhatsApp
- Email
- Ciudad
- Dirección
- Método de pago
- Notas del pedido

Métodos de pago iniciales:

- Transferencia bancaria
- Nequi
- Daviplata
- Pago contra entrega, si aplica
- WhatsApp para confirmar

Al finalizar:

- Se crea el pedido en base de datos.
- Se descuenta stock.
- Se muestra página de confirmación.
- Se genera mensaje para WhatsApp con resumen del pedido.
- El admin puede ver el pedido en el panel.

---

## 17. Panel administrador

## 17.1 Login

- Email
- Contraseña
- Validación JWT
- Protección de rutas privadas

## 17.2 Dashboard

Métricas principales:

- Total de productos
- Productos activos
- Productos con bajo stock
- Pedidos nuevos
- Pedidos pendientes de despacho
- Pedidos despachados
- Ventas totales

## 17.3 Gestión de productos

Funciones:

- Listar productos
- Buscar producto
- Filtrar por categoría
- Crear producto
- Editar producto
- Eliminar producto o desactivar
- Subir imágenes
- Controlar stock
- Marcar como destacado
- Marcar como activo/inactivo

## 17.4 Crear producto

Campos:

- Nombre
- Descripción corta
- Descripción larga
- Categoría
- Intención
- Precio
- Precio anterior
- Stock
- SKU
- Imágenes
- Ingredientes
- Modo de uso ritual
- Advertencias
- Etiquetas
- Destacado
- Activo

## 17.5 Pedidos / productos vendidos

Tabla con:

- Número de pedido
- Cliente
- WhatsApp
- Ciudad
- Total
- Estado de pago
- Estado de pedido
- Estado de despacho
- Fecha
- Acciones

Estados recomendados:

- Nuevo
- Confirmado
- En preparación
- Despachado
- Entregado
- Cancelado

Estados de pago:

- Pendiente
- Pagado
- Rechazado
- Reembolsado

## 17.6 Detalle de pedido

Debe mostrar:

- Datos del cliente
- Productos comprados
- Cantidades
- Total
- Método de pago
- Dirección de envío
- Notas
- Cambiar estado
- Agregar nota interna
- Marcar como despachado

---

## 18. API REST requerida

## 18.1 Auth admin

```txt
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## 18.2 Productos públicos

```txt
GET /api/products
GET /api/products/featured
GET /api/products/:slug
GET /api/products/category/:slug
```

## 18.3 Productos admin

```txt
POST   /api/admin/products
GET    /api/admin/products
GET    /api/admin/products/:id
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
PATCH  /api/admin/products/:id/status
```

## 18.4 Categorías

```txt
GET    /api/categories
POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

## 18.5 Pedidos

```txt
POST /api/orders
GET  /api/admin/orders
GET  /api/admin/orders/:id
PUT  /api/admin/orders/:id/status
PUT  /api/admin/orders/:id/payment-status
PUT  /api/admin/orders/:id/shipping-status
```

## 18.6 Dashboard

```txt
GET /api/admin/dashboard/stats
```

---

## 19. Reglas de negocio

1. El cliente puede comprar sin registrarse.
2. Todo pedido debe guardar datos de contacto del cliente.
3. El stock debe descontarse cuando el pedido se crea o cuando el admin confirma el pago, según decisión del negocio.
4. Si un producto tiene stock 0, debe mostrarse como agotado.
5. Un producto inactivo no debe aparecer en la tienda pública.
6. Solo usuarios administradores pueden entrar al panel privado.
7. Las imágenes deben optimizarse para web.
8. El checkout debe mostrar claramente que la compra será confirmada por WhatsApp si no hay pasarela activa.
9. Los textos espirituales no deben prometer curaciones, dinero garantizado ni resultados absolutos.
10. Cada producto debe tener una intención espiritual clara.

---

## 20. Seguridad

- Contraseñas encriptadas con bcrypt.
- JWT con expiración.
- Middleware para rutas privadas.
- Validación de datos con Zod o express-validator.
- Sanitización de entradas.
- Variables sensibles en `.env`.
- Protección CORS configurada.
- Validación de imágenes.
- Límite de tamaño de archivos.
- No exponer credenciales en frontend.

---

## 21. Variables de entorno

## 21.1 Backend

```env
PORT=5001
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/botanica_esoterica
JWT_SECRET=crear_un_secret_seguro
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
WHATSAPP_NUMBER=573001112233
```

## 21.2 Frontend

```env
VITE_API_URL=http://localhost:5001/api
VITE_WHATSAPP_NUMBER=573001112233
```

---

## 22. Comandos de instalación

## 22.1 Cliente

```bash
cd client
npm create vite@latest . -- --template react
npm install
npm install react-router-dom axios zustand react-hook-form zod lucide-react framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

## 22.2 Servidor

```bash
mkdir server
cd server
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer cloudinary slugify
npm install -D nodemon
```

---

## 23. Prompt principal para Codex

```txt
Actúa como arquitecto full stack senior. Vamos a desarrollar una tienda online llamada Botánica Esotérica Internacional.

Necesito construir una aplicación full stack con React, Vite, Tailwind CSS, Node.js, Express y MongoDB Atlas.

La tienda vende productos esotéricos para intención espiritual: suerte, abundancia, amor, dinero, salud, protección, limpieza energética, velas rituales, sahumerios, aceites, baños espirituales, amuletos y kits rituales.

El ecommerce público debe permitir comprar sin registro. El usuario puede navegar productos, filtrar por categoría/intención, ver detalle de producto, agregar al carrito y hacer checkout ingresando nombre, WhatsApp, email, ciudad, dirección, método de pago y notas. Al finalizar debe crearse un pedido en la base de datos y mostrar confirmación.

También necesito un panel administrador privado con login JWT para gestionar productos, categorías, inventario, pedidos, productos vendidos y despachos. El admin debe poder crear productos, editar, activar/desactivar, subir imágenes, controlar stock, ver pedidos nuevos, cambiar estados de pedido, pago y despacho.

Usa una estética premium, mística y elegante inspirada en un ecommerce vertical con hero, categorías destacadas, grilla de productos, banner promocional, sección educativa, galería visual y footer. Paleta: verde oscuro, crema ritual, dorado suave, terracota y marrón incienso.

Trabaja por fases. Primero crea la arquitectura del proyecto, luego modelos backend, rutas API, frontend público, carrito, checkout, panel admin y finalmente optimización responsive.

Entrega código limpio, modular, escalable y documentado. Antes de escribir código, propón la estructura de carpetas y el plan de implementación por fases.
```

---

## 24. Plan de ejecución por fases

## Fase 1: Base del proyecto

- Crear estructura client/server.
- Configurar React + Vite.
- Configurar Tailwind.
- Configurar Express.
- Conectar MongoDB Atlas.
- Crear variables de entorno.

## Fase 2: Backend ecommerce

- Crear modelos Product, Category, Order, AdminUser.
- Crear rutas públicas de productos y categorías.
- Crear ruta para crear pedido.
- Crear validaciones.

## Fase 3: Auth admin

- Crear login admin.
- Crear middleware JWT.
- Crear seed inicial de administrador.
- Proteger rutas admin.

## Fase 4: Frontend público

- Crear layout principal.
- Crear home inspirada en la referencia.
- Crear catálogo.
- Crear detalle de producto.
- Crear carrito.
- Crear checkout sin registro.
- Crear confirmación de pedido.

## Fase 5: Panel administrador

- Crear login.
- Crear dashboard.
- Crear CRUD de productos.
- Crear CRUD de categorías.
- Crear tabla de pedidos.
- Crear detalle de pedido.
- Crear actualización de estados.

## Fase 6: Imágenes y contenido

- Integrar Cloudinary.
- Subida de imágenes desde panel admin.
- Optimización de imágenes.
- Crear productos de prueba.

## Fase 7: UX/UI responsive

- Adaptar mobile.
- Animaciones sutiles.
- Estados loading.
- Estados empty.
- Mensajes de error.
- Validaciones visuales.

## Fase 8: Producción

- Preparar build frontend.
- Configurar backend en VPS o servicio cloud.
- Configurar variables de entorno reales.
- Conectar dominio.
- Activar HTTPS.
- Probar flujo completo.

---

## 25. Criterios de aceptación

El proyecto estará listo cuando:

- El usuario pueda comprar sin registrarse.
- El carrito funcione correctamente.
- El checkout cree pedidos reales en base de datos.
- El admin pueda iniciar sesión.
- El admin pueda crear, editar y desactivar productos.
- El admin pueda ver pedidos y cambiar estados.
- El stock se gestione correctamente.
- La web sea responsive.
- La estética sea coherente con una marca esotérica premium.
- El sistema tenga estructura limpia para escalar.

---

## 26. Primeros productos demo recomendados

1. Kit de Abundancia Dorada
2. Vela Ritual Abre Caminos
3. Baño Espiritual de Limpieza
4. Aceite Esotérico de Amor
5. Amuleto de Protección
6. Sahumerio de Prosperidad
7. Kit de Amor y Atracción
8. Incienso de Palo Santo
9. Hierbas para Limpieza Energética
10. Kit Protección del Hogar

---

## 27. Copy inicial para la Home

### Hero

**Botánica esotérica para transformar tu energía**

Encuentra productos rituales, velas, hierbas, aceites, amuletos y kits espirituales para acompañar tus intenciones de amor, abundancia, protección, salud y prosperidad.

**Comprar ahora**

### Categorías

**Elige la intención de tu ritual**

Explora productos creados para acompañar procesos espirituales de limpieza, atracción, protección y apertura de caminos.

### Productos

**Nuestros productos esotéricos**

Seleccionamos elementos espirituales para que puedas crear rituales conscientes, simbólicos y llenos de intención.

### Banner

**Abre caminos hacia la abundancia**

Kits rituales preparados para acompañar tus prácticas de prosperidad, claridad y conexión interior.

### Footer

**Botánica Esotérica Internacional**

Productos espirituales para rituales, intención y conexión energética. Cada elemento acompaña tu práctica con respeto, simbolismo y propósito.

---

## 28. Recomendación final de desarrollo

Para iniciar en Visual Studio Code con Codex, se recomienda trabajar en este orden:

1. Crear repositorio base.
2. Crear `client` y `server`.
3. Configurar backend y conexión MongoDB.
4. Crear modelos.
5. Crear APIs públicas.
6. Crear frontend público con datos mock.
7. Conectar frontend con backend.
8. Crear carrito local.
9. Crear checkout y pedidos.
10. Crear auth admin.
11. Crear panel administrador.
12. Integrar subida de imágenes.
13. Optimizar responsive.
14. Preparar despliegue.

Este documento debe usarse como guía central para que Codex genere el proyecto de forma ordenada, modular y escalable.

