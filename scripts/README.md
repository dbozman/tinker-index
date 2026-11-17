# Scripts

| Script | Purpose |
|---|---|
| `db-tunnel.sh` | SSH tunnel laptop `localhost:5432` → Mac mini `127.0.0.1:5436` |
| `db-up-remote.sh` | Start the dedicated Tinker Index Postgres compose project on the mini |
| `db-down-remote.sh` | Stop only that compose project |

Prefer the pnpm wrappers: `pnpm db:tunnel`, `pnpm db:up:remote`, `pnpm db:down:remote`.
