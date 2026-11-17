# Implementation plan

Phased milestones derived from [`architecture.md`](architecture.md) §16 and the setup engineering plan.

## Milestone overview

| ID | Name | Acceptance |
|---|---|---|
| M1 | Repository foundation | `pnpm install`, lint, typecheck, test, and build succeed; stub apps start |
| M2a | Database + health | Prisma migrations apply; `/health` uses DB readiness |
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
