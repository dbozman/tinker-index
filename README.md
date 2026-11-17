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
apps/web              Public Angular site (+ admin later)
apps/api              NestJS REST API (Prisma schema/migrations)
apps/worker           Background job entry point
packages/contracts    Shared types / contracts
docs/                 Architecture, plan, ADRs, conventions
docker-compose.yml    Local PostgreSQL
```

## Prerequisites

- Node.js 24 (`nvm use` reads `.nvmrc`)
- pnpm 10+
- Docker Desktop (or another local Docker engine) for PostgreSQL

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm db:migrate
pnpm build
pnpm test
```

### Local PostgreSQL

The simplest reliable local setup is Docker Compose:

```bash
pnpm db:up          # starts postgres:16-alpine on localhost:5432
pnpm db:logs        # follow container logs
pnpm db:down        # stop the container
```

Default connection string (also in `.env.example`):

```text
DATABASE_URL=postgresql://tinker:tinker@localhost:5432/tinker_index
```

### Prisma commands

```bash
pnpm db:generate           # generate Prisma Client into apps/api/src/generated/prisma
pnpm db:migrate            # create/apply migrations in development
pnpm db:migrate:deploy     # apply existing migrations (CI/production-style)
```

### Start the API and verify connectivity

```bash
pnpm dev:api
```

- Liveness: `GET http://localhost:3000/api/v1/health` → `200` (status `ok` or `degraded`)
- Readiness: `GET http://localhost:3000/api/v1/health/ready` → `200` when DB is up, `503` when DB is down

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
pnpm dev:web      # http://localhost:4200
```

Copy `.env.example` to `.env` for local placeholders. Do not commit secrets.

## Validation scripts

| Script | Purpose |
|---|---|
| `pnpm lint` | ESLint across workspace packages |
| `pnpm typecheck` | TypeScript checks (generates Prisma Client first) |
| `pnpm test` | Unit tests |
| `pnpm test:e2e` | API e2e + DB integration (integration skips without `DATABASE_URL`) |
| `pnpm test:db` | Database integration tests only |
| `pnpm build` | Production builds |

## Current milestone

**Milestone 2a — Database + Health** adds PostgreSQL/Prisma foundation and readiness checks.

See [`docs/implementation-plan.md`](docs/implementation-plan.md).
