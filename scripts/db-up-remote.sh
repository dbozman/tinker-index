#!/usr/bin/env bash
# Start (or recreate) the dedicated Tinker Index Postgres container on the Mac mini.
# Does not touch unrelated containers.
set -euo pipefail

REMOTE_HOST="${TINKER_DB_SSH_HOST:-danebozman@Danes-Mac-mini.local}"
REMOTE_DIR="${TINKER_DB_REMOTE_DIR:-~/Projects/tinker-index-db}"

echo "Ensuring remote compose project is up on ${REMOTE_HOST}:${REMOTE_DIR}"
ssh -o BatchMode=yes "${REMOTE_HOST}" "cd ${REMOTE_DIR} && docker compose up -d && docker compose ps"
