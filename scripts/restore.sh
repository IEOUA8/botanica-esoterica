#!/usr/bin/env bash
# MongoDB restore script for Botánica Esotérica Internacional
# Usage: ./scripts/restore.sh <backup-file.tar.gz>
# WARNING: This REPLACES the current database contents.
set -euo pipefail

BACKUP_FILE="${1:-}"
MONGO_CONTAINER="${MONGO_CONTAINER:-botanica-mongo}"
DB_NAME="${DB_NAME:-botanica_esoterica}"
TEMP_DIR=$(mktemp -d)

if [[ -z "${BACKUP_FILE}" ]]; then
  echo "Usage: $0 <backup-file.tar.gz>"
  exit 1
fi

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "Error: backup file not found: ${BACKUP_FILE}"
  exit 1
fi

echo "[$(date -Iseconds)] Restoring from ${BACKUP_FILE}"
echo "WARNING: Database '${DB_NAME}' will be replaced. Press Ctrl-C to cancel (5s)..."
sleep 5

# Extract backup
tar -xzf "${BACKUP_FILE}" -C "${TEMP_DIR}"
DUMP_DIR=$(find "${TEMP_DIR}" -maxdepth 1 -mindepth 1 -type d | head -1)

# Copy into container and restore
docker cp "${DUMP_DIR}" "${MONGO_CONTAINER}:/tmp/restore_dump"
docker exec "${MONGO_CONTAINER}" \
  mongorestore \
    --db "${DB_NAME}" \
    --drop \
    --dir "/tmp/restore_dump/${DB_NAME}" \
    --quiet

docker exec "${MONGO_CONTAINER}" rm -rf /tmp/restore_dump
rm -rf "${TEMP_DIR}"

echo "[$(date -Iseconds)] Restore complete."
