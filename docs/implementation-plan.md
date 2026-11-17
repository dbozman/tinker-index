# Implementation plan

Phased milestones derived from [`architecture.md`](architecture.md) §16 and the setup engineering plan.

## Milestone overview

| ID | Name | Acceptance |
|---|---|---|
| M1 | Repository foundation | `pnpm install`, lint, typecheck, test, and build succeed; stub apps start |
| M2a | Database + health | Prisma migrations apply; `/health` and `/health/ready` report DB status |
| M2b | Catalog API | Seeded projects/categories returned from public GET APIs |
| M3a | Design + home | Local home renders via SSR/prerender |
| M3b | Public catalog UX | Browse, detail, categories, search/filter + SEO metadata |
| M4a | Admin auth | Administrator can sign in (provider ADR first) |
| M4b | Editorial workflow | Review, approve/reject/publish |
| M5a | Agent intake | Authenticated Hermes discovery submission + dedupe |
| M5b | Jobs + AI evaluation | DB-backed jobs produce reviewable drafts |
| M6 | Production deploy | Railway + Cloudflare + R2 + CI/CD live |
| M7 | Catalog launch | 50–150 curated published projects |

## Milestone 1 — Repository foundation (complete)

### In scope

- pnpm workspace monorepo
- `apps/web` Angular 21 hybrid SSR stub
- `apps/api` NestJS 12 stub with `/api/v1/health`
- `apps/worker` Nest application-context stub
- `packages/contracts` shared health type
- ESLint, Prettier, Vitest, GitHub Actions CI
- Docs: versions, conventions, ADRs, this plan

### Out of scope

- Prisma / PostgreSQL
- Domain catalog APIs
- Auth, R2, Cloudflare, Hermes, Playwright e2e
- Visual design system beyond a minimal shell

### Verification

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev:api    # GET /api/v1/health
pnpm dev:worker # logs ready
pnpm dev:web    # serves stub home
```

## Milestone 2a — Database + health (complete)

### In scope

- PostgreSQL via Docker Compose (`postgres:16-alpine`)
- Prisma 7 + `@prisma/adapter-pg` under `apps/api`
- Minimal `SchemaMeta` model and initial migration (no catalog domain model)
- Global Nest `PrismaModule` / `PrismaService` with connect lifecycle
- Liveness `GET /api/v1/health` and readiness `GET /api/v1/health/ready`
- Unit, e2e, and real PostgreSQL integration tests
- README + pnpm database scripts

### Out of scope

- Project/category/catalog APIs (Milestone 2b)
- Hermes, admin, R2, production Railway provisioning

### Verification

```bash
pnpm install
cp .env.example .env          # set real secrets locally (gitignored)
pnpm db:up:remote             # dedicated Postgres on Mac mini
pnpm db:tunnel                # localhost:5432 -> mini 127.0.0.1:5436
pnpm db:migrate:deploy
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm dev:api
# GET /api/v1/health        → 200
# GET /api/v1/health/ready  → 200 when DB is up
```

### Development database topology

- Preferred: Mac mini Docker Postgres bound to `127.0.0.1:5436`, accessed via SSH tunnel to laptop `localhost:5432`.
- Compose template: [`infra/mac-mini-db/`](../infra/mac-mini-db/).
- Do not reuse unrelated mini containers/volumes.
