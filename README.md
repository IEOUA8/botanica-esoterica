# Botánica Esotérica Internacional

Aplicación full stack para ecommerce público y panel administrador privado.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Zustand, Axios, Lucide, Framer Motion.
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt.
- Desarrollo: MongoDB local transaccional mediante Docker Compose o datos demo activados explícitamente.

## Ejecutar en desarrollo

```bash
npm ci
npm ci --prefix server
npm ci --prefix client
npm run db:up
npm run dev
```

URLs:

- Web: http://localhost:5173
- API: http://localhost:5001/api/health
- Admin: http://localhost:5173/admin/login

Credenciales demo:

- Email: `admin@botanica.test`
- Contraseña: `Admin12345`

## Variables de entorno

Configura `server/.env` para producción o MongoDB Atlas:

```env
PORT=5001
NODE_ENV=production
DEMO_MODE=false
SEED_DEMO_DATA=false
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/botanica_esoterica
JWT_SECRET=crear_un_secret_seguro
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
TRUST_PROXY=1
WHATSAPP_NUMBER=573001112233
ADMIN_EMAIL=admin@tu-dominio.com
ADMIN_PASSWORD=crear_una_contraseña_segura
SHIPPING_FLAT_RATE=0
FREE_SHIPPING_THRESHOLD=0
```

Configura `client/.env`:

```env
VITE_API_URL=http://localhost:5001/api
VITE_WHATSAPP_NUMBER=573001112233
```

## Build

```bash
npm run build
```

El build de frontend queda en `client/dist`.

## Seguridad del entorno

- El modo en memoria solo se activa explícitamente con `DEMO_MODE=true` y está bloqueado en producción.
- `JWT_SECRET` debe tener al menos 32 caracteres.
- `CLIENT_URL` acepta una lista de orígenes separados por comas.
- `TRUST_PROXY` solo debe configurarse cuando la API esté detrás de un proxy conocido.

## Base de datos local

```bash
npm run db:up
npm run db:logs
npm run db:down
```

La instancia local usa una réplica MongoDB para soportar transacciones. Configura el backend con:

```env
DEMO_MODE=false
SEED_DEMO_DATA=true
MONGO_URI=mongodb://127.0.0.1:27017/botanica_esoterica?replicaSet=rs0
```

Las semillas solo se crean cuando las colecciones están vacías. Los pedidos usan `Idempotency-Key`, precios calculados por el servidor y reservas atómicas de inventario.
