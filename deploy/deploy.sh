#!/usr/bin/env bash
set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
SSH_USER="podlomar"
SSH_HOST="chesscub.podlomar.me"
REMOTE_DIR="/var/www/chesscub.podlomar.me"
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "▶ Building..."
cd "$PROJECT_DIR"
npm run build

echo "▶ Deploying to ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}..."
rsync \
  --archive \
  --compress \
  --delete \
  --progress \
  "$PROJECT_DIR/dist/" \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"

rsync \
  --archive \
  --compress \
  --progress \
  "$PROJECT_DIR/package.json" \
  "$PROJECT_DIR/package-lock.json" \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"

echo "▶ Installing production dependencies..."
ssh "${SSH_USER}@${SSH_HOST}" "bash -lc 'cd ${REMOTE_DIR} && npm ci --omit=dev'"

echo "▶ Restarting service..."
ssh "${SSH_USER}@${SSH_HOST}" "sudo systemctl restart chesscub"

echo "✓ Done — https://${SSH_HOST}"
