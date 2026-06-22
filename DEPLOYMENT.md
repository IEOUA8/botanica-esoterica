# Guía de Despliegue — Botánica Esotérica Internacional

## Arquitectura de producción

```
Internet
  │
  ▼
Traefik (HTTPS / Let's Encrypt)
  ├── /* → web (Nginx + React build)
  │         └── /api/* → api (Node.js :5001)
  └── api.dominio.com → api (opcional, dominio dedicado)
                          └── mongo (MongoDB :27017, red interna)
```

Los tres servicios corren en el mismo servidor vía Docker Compose.
La base de datos **nunca** se expone a Internet; sólo la red interna de Docker la ve.

---

## Pre-requisitos del servidor

- VPS con Ubuntu 22.04+ o Debian 12+
- Docker Engine ≥ 26 y Docker Compose Plugin ≥ 2.27
- Dominio apuntando a la IP del servidor (registro A y www)
- Puertos 80 y 443 abiertos en el firewall

```bash
# Instalar Docker (una sola vez)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker
```

---

## Primer despliegue

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-ORG/botanica-internacional.git /opt/botanica
cd /opt/botanica
```

### 2. Configurar variables de entorno

```bash
cp server/.env.example server/.env.production
nano server/.env.production
```

Valores **obligatorios** en producción:

| Variable | Descripción |
|---|---|
| `MONGO_URI` | URI de MongoDB Atlas o self-hosted |
| `JWT_SECRET` | Cadena aleatoria ≥ 32 chars. Generar con: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL` | Email del administrador |
| `ADMIN_PASSWORD` | Contraseña ≥ 12 chars |
| `CLIENT_URL` | URL pública del frontend, p.ej. `https://botanica.example.com` |
| `NODE_ENV` | `production` |
| `DEMO_MODE` | `false` |
| `TRUST_PROXY` | `1` (detrás de Traefik/Nginx) |

### 3. Configurar la red de Traefik

```bash
docker network create web
```

> Si ya tienes Traefik corriendo en el servidor, asegúrate de que use la red `web` y tenga `letsencrypt` como certresolver.

### 4. Lanzar los servicios

```bash
DOMAIN=botanica.example.com \
VITE_API_URL=https://botanica.example.com/api \
VITE_WHATSAPP_NUMBER=573001112233 \
docker compose -f compose.prod.yaml up -d --build
```

### 5. Verificar el despliegue

```bash
# Estado de los contenedores
docker compose -f compose.prod.yaml ps

# Health check de la API
curl -s https://botanica.example.com/api/health | jq

# Logs de la API
docker compose -f compose.prod.yaml logs -f api
```

La respuesta esperada del health check:

```json
{ "status": "ok", "app": "Botánica Esotérica Internacional", "database": "connected" }
```

---

## Actualizar a una nueva versión

```bash
cd /opt/botanica

# Backup preventivo de la base de datos
./scripts/backup.sh

# Descargar los cambios
git pull origin main

# Reconstruir y reiniciar sólo los servicios que cambiaron
DOMAIN=botanica.example.com \
VITE_API_URL=https://botanica.example.com/api \
VITE_WHATSAPP_NUMBER=573001112233 \
docker compose -f compose.prod.yaml up -d --build

# Confirmar que la API responde
curl -s http://localhost:5001/api/health
```

---

## Rollback

Si una actualización introduce un problema:

### Rollback de código

```bash
# Ver historial de commits
git log --oneline -10

# Volver al commit anterior
git checkout <COMMIT-HASH>

# Reconstruir con la versión anterior
docker compose -f compose.prod.yaml up -d --build api web
```

### Rollback de base de datos

```bash
# Listar backups disponibles
ls -lht /var/backups/botanica/

# Restaurar un backup específico
./scripts/restore.sh /var/backups/botanica/20260620_020001.tar.gz
```

---

## Backups de MongoDB

### Manual

```bash
./scripts/backup.sh
```

Los backups se guardan en `/var/backups/botanica/` y se conservan 30 días.

### Automático (cron)

```bash
# Editar crontab del usuario que corre Docker
crontab -e

# Agregar (backup diario a las 2am):
0 2 * * * /opt/botanica/scripts/backup.sh >> /var/log/botanica-backup.log 2>&1
```

### Verificar backups

```bash
# Listar y tamaños
ls -lsh /var/backups/botanica/

# Probar restauración en base de datos temporal (no afecta producción)
docker exec botanica-mongo mongorestore \
  --db botanica_esoterica_test \
  --drop \
  --archive=/backups/ARCHIVO.tar.gz \
  --gzip
```

---

## Monitoreo

### Logs estructurados

```bash
# API en tiempo real
docker compose -f compose.prod.yaml logs -f api

# Todos los servicios
docker compose -f compose.prod.yaml logs -f
```

### Métricas de contenedores

```bash
docker stats botanica-api botanica-web botanica-mongo
```

### Health checks automáticos

Docker reinicia automáticamente cualquier contenedor cuyo health check falle 3 veces.

```bash
# Ver estado de los health checks
docker inspect botanica-api | jq '.[0].State.Health'
```

---

## Variables de entorno del cliente (frontend)

Se fijan en tiempo de **build** (no en runtime). Para cambiarlas hay que reconstruir la imagen:

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API (`https://botanica.example.com/api`) |
| `VITE_WHATSAPP_NUMBER` | Número en formato internacional sin `+` |

---

## Secretos en GitHub Actions (despliegue automático)

Para activar el workflow `deploy.yml`, configura estos secretos en `Settings → Secrets`:

| Secreto | Valor |
|---|---|
| `DEPLOY_HOST` | IP o hostname del servidor |
| `DEPLOY_USER` | Usuario SSH con acceso a Docker |
| `DEPLOY_SSH_KEY` | Clave privada SSH (sin passphrase) |

Y estas variables de entorno en `Settings → Variables`:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://botanica.example.com/api` |
| `VITE_WHATSAPP_NUMBER` | Número WhatsApp |

---

## Hardening adicional

```bash
# Firewall: permitir sólo SSH, HTTP y HTTPS
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Crear usuario sin privilegios para Docker (no root)
adduser botanica --disabled-password
usermod -aG docker botanica
su - botanica
```

---

## Estructura de directorios en el servidor

```
/opt/botanica/          ← repositorio clonado
  server/.env.production
  compose.prod.yaml
  scripts/
    backup.sh
    restore.sh

/var/backups/botanica/  ← backups MongoDB (creado por backup.sh)
/var/log/botanica-backup.log ← log de backups
```
