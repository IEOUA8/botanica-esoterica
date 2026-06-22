#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

for command in node npm docker; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Falta '$command'. Instálalo antes de continuar." >&2
    exit 1
  fi
done

if ! docker info >/dev/null 2>&1; then
  echo "Docker no está activo. Inicia Docker Desktop y vuelve a intentarlo." >&2
  exit 1
fi

create_env() {
  local example_file="$1"
  local env_file="$2"

  if [[ -f "$env_file" ]]; then
    echo "Conservando $env_file existente."
    return
  fi

  cp "$example_file" "$env_file"
  echo "Creado $env_file desde $example_file."
}

create_env "server/.env.example" "server/.env"
create_env "client/.env.example" "client/.env"

if grep -q '^JWT_SECRET=replace-with-a-long-random-secret$' server/.env; then
  jwt_secret="$(node -e "process.stdout.write(require('crypto').randomBytes(48).toString('hex'))")"
  temp_env="$(mktemp)"
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" == JWT_SECRET=* ]]; then
      printf 'JWT_SECRET=%s\n' "$jwt_secret"
    else
      printf '%s\n' "$line"
    fi
  done < server/.env > "$temp_env"
  mv "$temp_env" server/.env
  chmod 600 server/.env
  echo "Generado JWT_SECRET para desarrollo local."
fi

echo "Instalando dependencias..."
npm ci
npm ci --prefix server
npm ci --prefix client

echo "Iniciando MongoDB..."
docker compose up -d --wait

echo
echo "Entorno local listo. Ejecuta: npm run dev"
echo "Web:   http://localhost:5173"
echo "API:   http://localhost:5001/api/health"
echo "Admin: http://localhost:5173/admin/login"
