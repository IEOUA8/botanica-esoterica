#!/usr/bin/env bash
# MongoDB backup script for Botánica Esotérica Internacional
# Usage: ./scripts/backup.sh
# Cron example (daily at 2am): 0 2 * * * /path/to/scripts/backup.sh >> /var/log/botanica-backup.log 2>&1
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/botanica}"
MONGO_CONTAINER="${MONGO_CONTAINER:-botanica-mongo}"
DB_NAME="${DB_NAME:-botanica_esoterica}"
RETAIN_DAYS="${RETAIN_DAYS:-30}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"

echo "[$(date -Iseconds)] Starting backup → ${BACKUP_PATH}"

mkdir -p "${BACKUP_DIR}"

# Dump inside the container and copy out
docker exec "${MONGO_CONTAINER}" \
  mongodump \
    --db "${DB_NAME}" \
    --out "/backups/${TIMESTAMP}" \
    --quiet

docker cp "${MONGO_CONTAINER}:/backups/${TIMESTAMP}" "${BACKUP_PATH}"

# Compress
tar -czf "${BACKUP_PATH}.tar.gz" -C "${BACKUP_DIR}" "${TIMESTAMP}"
rm -rf "${BACKUP_PATH}"

# Remove old backups beyond RETAIN_DAYS
find "${BACKUP_DIR}" -name "*.tar.gz" -mtime "+${RETAIN_DAYS}" -delete

SIZE=$(du -sh "${BACKUP_PATH}.tar.gz" | cut -f1)
echo "[$(date -Iseconds)] Backup complete: ${BACKUP_PATH}.tar.gz (${SIZE})"
