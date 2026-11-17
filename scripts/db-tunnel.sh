#!/usr/bin/env bash
# Forward laptop localhost:5432 -> Mac mini loopback Postgres (127.0.0.1:5436).
set -euo pipefail

REMOTE_HOST="${TINKER_DB_SSH_HOST:-danebozman@Danes-Mac-mini.local}"
LOCAL_PORT="${TINKER_DB_LOCAL_PORT:-5432}"
REMOTE_PORT="${TINKER_DB_REMOTE_PORT:-5436}"

if lsof -nP -iTCP:"${LOCAL_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${LOCAL_PORT} is already in use on this Mac."
  echo "Stop the other listener, or set TINKER_DB_LOCAL_PORT to a free port."
  exit 1
fi

echo "Opening SSH tunnel: localhost:${LOCAL_PORT} -> ${REMOTE_HOST}:127.0.0.1:${REMOTE_PORT}"
echo "Keep this terminal open. Press Ctrl+C to close the tunnel."
exec ssh -N -o ExitOnForwardFailure=yes -L "${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT}" "${REMOTE_HOST}"
