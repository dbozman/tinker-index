# Tinker Index

Discover your next DIY project.

AI-powered DIY project discovery platform. Architecture: [`docs/architecture.md`](docs/architecture.md). Agent instructions: [`AGENTS.md`](AGENTS.md).

## Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces |
| Node.js | 24 LTS |
| Web | Angular 21 (hybrid SSR/SSG) |
| API | NestJS 12 |
| Worker | NestJS application context |
| Contracts | Shared TypeScript package |
| Database | PostgreSQL 16 + Prisma 7 |

## Repository layout

```text
apps/web                 Public Angular site (+ admin later)
apps/api                 NestJS REST API (Prisma schema/migrations)
apps/worker              Background job entry point
packages/contracts       Shared types / contracts
infra/mac-mini-db        Compose template for Mac mini Postgres
scripts/                 SSH tunnel / remote DB helpers
docs/                    Architecture, plan, ADRs, conventions
docker-compose.yml       Optional local Postgres (if a local Docker engine exists)
```

## Prerequisites

- Node.js 24 (`nvm use` reads `.nvmrc`)
- pnpm 10+
- SSH access to the Mac mini (`username@hostname.local`) for the preferred DB path

## Quick start (preferred: Mac mini Postgres + SSH tunnel)

```bash
pnpm install
cp .env.example .env
# Put the real POSTGRES_PASSWORD / DATABASE_URL in .env (never commit it)

pnpm db:up:remote   # starts dedicated container on the Mac mini (once)
pnpm db:tunnel      # keep this terminal open (localhost:5432 -> mini:5436)

# In another terminal:
pnpm db:migrate:deploy
pnpm build
pnpm test
pnpm test:e2e
pnpm dev:api
```

### SSH tunnel details

| Side | Address |
|---|---|
| Mac mini Docker publish | `127.0.0.1:5436` only (not internet-facing) |
| Laptop via tunnel | `localhost:5432` |
| Database | `tinker_index` |
| User | `tinker` |

Convenient commands:

```bash
pnpm db:tunnel        # ssh -N -L 5432:127.0.0.1:5436 …
pnpm db:up:remote     # docker compose up -d on the mini
pnpm db:down:remote   # docker compose stop on the mini (this project only)
```

Compose files for the mini live in [`infra/mac-mini-db/`](infra/mac-mini-db/) and are deployed to `~/Projects/tinker-index-db` on the mini.

### Optional local Docker Postgres

If you later have a local Docker engine:

```bash
pnpm db:up
pnpm db:logs
pnpm db:down
```

Set `POSTGRES_PASSWORD` in `.env` first. Local Compose also binds to `127.0.0.1` only.

### Prisma commands

```bash
pnpm db:generate           # generate Prisma Client into apps/api/src/generated/prisma
pnpm db:migrate            # create/apply migrations in development
pnpm db:migrate:deploy     # apply existing migrations (CI/production-style)
pnpm db:seed               # idempotent demo catalog seed (fictional data)
```

Catalog API reference: [`docs/catalog-api.md`](docs/catalog-api.md).

### Start the API and verify connectivity

```bash
pnpm db:tunnel   # separate terminal
pnpm db:seed     # once migrations are applied
pnpm dev:api
```

- Liveness: `GET http://localhost:3000/api/v1/health` → `200` (status `ok` or `degraded`)
- Readiness: `GET http://localhost:3000/api/v1/health/ready` → `200` when DB is up, `503` when DB is down
- Catalog: `GET http://localhost:3000/api/v1/projects`
- OpenAPI: `http://localhost:3000/api/docs`

Healthy readiness response shape:

```json
{
  "status": "ok",
  "service": "api",
  "timestamp": "...",
  "checks": { "database": { "status": "up" } }
}
```

Responses never include connection strings or credentials.

### Other local apps

```bash
pnpm dev:worker   # application-context worker stub
pnpm dev:api      # http://localhost:3000 — required for homepage catalog data
pnpm dev:web      # http://localhost:4200 (SSR/dev server; calls API_BASE_URL)
```

Homepage (`/`) uses SSR and loads featured projects + categories from the Nest API. Set `API_BASE_URL` in `.env` (default `http://localhost:3000/api/v1`). The Angular build does **not** require Postgres; only a running API is needed when serving the home page.

Production-style web smoke:

```bash
pnpm build
API_BASE_URL=http://localhost:3000/api/v1 node apps/web/dist/web/server/server.mjs
# open http://localhost:4000 — featured project titles should appear in View Source
```

## Validation scripts

| Script | Purpose |
|---|---|
| `pnpm lint` | ESLint across workspace packages |
| `pnpm typecheck` | TypeScript checks (generates Prisma Client first) |
| `pnpm test` | Unit tests |
| `pnpm test:e2e` | API e2e + DB integration (needs tunnel + `DATABASE_URL`) |
| `pnpm test:db` | Database integration tests only |
| `pnpm build` | Production builds |

## Current milestone

**Milestone 3a — Design system & homepage** — public SSR homepage with catalog API integration.

See [`docs/implementation-plan.md`](docs/implementation-plan.md).
