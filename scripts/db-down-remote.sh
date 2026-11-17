#!/usr/bin/env bash
# Stop only the Tinker Index Postgres compose project on the Mac mini.
set -euo pipefail

REMOTE_HOST="${TINKER_DB_SSH_HOST:-danebozman@Danes-Mac-mini.local}"
REMOTE_DIR="${TINKER_DB_REMOTE_DIR:-~/Projects/tinker-index-db}"

echo "Stopping tinker-index Postgres on ${REMOTE_HOST}:${REMOTE_DIR}"
ssh -o BatchMode=yes "${REMOTE_HOST}" "cd ${REMOTE_DIR} && docker compose stop"
