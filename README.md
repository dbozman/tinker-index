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
| Database | PostgreSQL + Prisma 7 (Milestone 2+) |

## Repository layout

```text
apps/web              Public Angular site (+ admin later)
apps/api              NestJS REST API
apps/worker           Background job entry point
packages/contracts    Shared types / contracts
docs/                 Architecture, plan, ADRs, conventions
```

## Prerequisites

- Node.js 24 (`nvm use` reads `.nvmrc`)
- pnpm 10+

## Quick start

```bash
pnpm install
pnpm build
pnpm test
```

### Local development

```bash
pnpm dev:api      # http://localhost:3000/api/v1/health
pnpm dev:worker   # application-context worker stub
pnpm dev:web      # http://localhost:4200
```

Copy `.env.example` to `.env` for local placeholders. Do not commit secrets.

## Validation scripts

| Script | Purpose |
|---|---|
| `pnpm lint` | ESLint across workspace packages |
| `pnpm typecheck` | TypeScript checks |
| `pnpm test` | Unit tests (Vitest / node:test) |
| `pnpm build` | Production builds |

## Current milestone

**Milestone 1 — Repository foundation** is in progress / complete when install, lint, typecheck, test, and build succeed and the stub apps start.

See [`docs/implementation-plan.md`](docs/implementation-plan.md).
