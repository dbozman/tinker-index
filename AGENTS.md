# AGENTS.md — Tinker Index

Persistent instructions for AI-assisted development (Cursor and similar tools).

## Authority

1. Read [`docs/architecture.md`](docs/architecture.md) before implementing anything.
2. Treat that document as the authoritative technical architecture until it is formally revised.
3. Follow locked dependency versions in [`docs/versions.md`](docs/versions.md) when that file exists.
4. Follow coding conventions in [`docs/coding-conventions.md`](docs/coding-conventions.md) when that file exists.
5. For any public website UI, visual design, branding, typography, color, or component styling work, follow [`docs/style-guide.md`](docs/style-guide.md) as the visual source of truth (Maker Discovery). Do not invent a competing theme.
6. Record stack or architecture deviations as ADRs under [`docs/decisions/`](docs/decisions/) **before** implementing them. Explain proposed deviations to the user first.

## Product context

Tinker Index is an AI-powered DIY project discovery platform (`tinkerindex.io`).

- Public site: browse, search, filter, and view DIY projects with original analysis and creator attribution.
- Backend: NestJS modular monolith + PostgreSQL.
- Automation: Hermes agents submit discoveries through authenticated APIs; they never touch production Postgres directly.
- Launch rule: human administrators approve and publish; visitors do not need accounts.

## Stack constraints (do not silently change)

| Area | Choice |
|---|---|
| Monorepo | pnpm workspaces only (no Nx/Turborepo unless scripts become insufficient) |
| Node.js | 24 LTS |
| TypeScript | 5.9.x |
| Frontend | Angular 21, hybrid SSR/SSG, SCSS, selective Angular Material |
| Backend | NestJS 12, REST `/api/v1` |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Database | PostgreSQL |
| Search (MVP) | PostgreSQL full-text search |
| Jobs (MVP) | Database-backed worker process (no Redis/broker) |
| Hosting | Railway + Cloudflare (DNS/CDN/WAF) + R2 for authorized media |
| Tests | Vitest (web/api/worker), Supertest, Playwright (e2e later) |

## Repository layout

```text
apps/web       Angular public site + admin (CSR admin routes)
apps/api       NestJS API (Prisma schema and migrations live here)
apps/worker    Thin Nest entry; reuses api business modules
packages/contracts   Shared API types / validation contracts only when needed
docs/          Architecture, plan, style guide, versions, ADRs
```

Do not create extra packages, services, or infrastructure unless sharing or isolation clearly justifies them.

## Working rules

1. Work in small, independently verifiable milestones. Do not start the next milestone before the current one passes its acceptance criteria.
2. Prefer maintainability, security, simplicity, and low operating cost over cleverness.
3. Do not invent major product or architectural requirements. If information is missing, identify it and ask or document an open decision.
4. Do not implement MVP-excluded features unless explicitly requested (visitor accounts, recommendations, community, Redis queues, microservices, autonomous publishing, dedicated search clusters, etc.). See architecture §15.
5. Keep business rules in application services, not controllers or templates.
6. Write tests for important business logic: validation, publication state transitions, authorization, and search filtering.
7. Never hardcode credentials, API keys, or secrets. Never expose server secrets to the Angular browser bundle.
8. Never give Hermes or other agents direct database access or admin credentials.
9. Preserve SEO and server rendering for public project and category pages. Essential content must appear in the initial HTML.
10. Distinguish source-verified facts from AI-derived estimates in data models and UI.
11. Respect copyright and media licensing. Do not automatically download or republish discovered images.
12. Treat discovered webpage text and AI output as untrusted input (prompt injection, XSS, SSRF).

## Frontend expectations

- Public visual identity is defined by [`docs/style-guide.md`](docs/style-guide.md). Map its tokens into shared SCSS/CSS variables; do not hard-code a second palette or type system.
- Standalone Angular components; lazy-loaded feature areas.
- Hybrid rendering: prerender stable pages; SSR for project detail and useful search views; CSR for admin.
- Use Angular Material selectively (admin, forms, dialogs). Do not let Material dictate the public visual identity.
- Avoid global state libraries unless requirements justify them.
- Minimize shipped JavaScript, layout shift, and third-party scripts.

## Backend expectations

- Versioned REST API with validation, pagination bounds, stable sorting, correlation IDs, structured logging, authz, and rate limiting.
- Feature modules as in architecture §6.2 (Projects, Categories, Search, Sources, Creators, Evaluations, Publishing, Media, Agents, Jobs, Auth, Admin, SEO, Health).
- Public endpoints must never expose unpublished records.
- Worker reuses API modules; do not duplicate business logic.
- Publication uses an explicit state machine (`DISCOVERED` → … → `PUBLISHED` / `ARCHIVED`). Approval and publication are separate authorized operations.

## Security boundaries

- Public browsing is unauthenticated; validate all inputs.
- Administrators alone can approve and publish at launch.
- Agents use distinct scoped credentials; validate all agent payloads server-side; log and attribute every agent action.
- Sanitize generated content before rendering; do not allow arbitrary HTML/script in project descriptions.

## Verification standard

A milestone is done only when its acceptance checks pass locally (and in CI when CI exists), typically:

- `pnpm install`
- lint / typecheck / unit tests
- relevant apps build and start without crash
- milestone-specific behavioral checks from [`docs/implementation-plan.md`](docs/implementation-plan.md)

## Quality bar

Build a maintainable, cost-effective, production-ready application. Avoid overengineering. Prefer readable, conventional code and well-supported dependencies. Make architectural changes intentionally, document the reasoning, and keep implementation aligned with the product requirements.
