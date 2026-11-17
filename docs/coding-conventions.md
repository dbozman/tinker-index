# Coding conventions

Project-wide guidelines for Tinker Index. Aligns with [`AGENTS.md`](../AGENTS.md) and [`architecture.md`](architecture.md).

## TypeScript

- Enable strict checking in application packages.
- Avoid `any`; prefer `unknown` and narrowing.
- Explicit return types on exported public service and controller methods.
- Prefer `import type` for type-only imports.

## Formatting and linting

- Prettier for formatting (root `.prettierrc`).
- ESLint flat config per package.
- 2-space indentation, LF endings (`.editorconfig`).
- Run `pnpm lint` and `pnpm format:check` before opening a PR.

## Angular (`apps/web`)

- Standalone components only.
- Feature areas with lazy-loaded routes when features exist.
- Hybrid rendering via `app.routes.server.ts` (`RenderMode`).
- SCSS with CSS variables for brand tokens (Milestone 3+).
- Angular Material only for admin/forms/dialogs — not the public visual identity.
- No global state library unless requirements justify it.
- Unit tests with Vitest (`ng test`).

## NestJS (`apps/api`, `apps/worker`)

- Feature modules with thin controllers and service-layer business rules.
- Versioned REST under `/api/v1`.
- Validate inputs with DTOs when endpoints grow beyond stubs.
- Consistent error responses and correlation IDs (Milestone 2+).
- Never expose unpublished catalog records on public endpoints.
- Worker reuses API modules; do not duplicate domain logic.
- Unit tests with Vitest (NestJS 12 ESM packages work poorly with Jest without experimental flags).

## Shared contracts (`packages/contracts`)

- Export stable DTO/types used by more than one app.
- Keep the package small; do not dump application services here.

## Data and provenance (from Milestone 2)

- Prisma is the only data-access path to PostgreSQL.
- AI-derived fields must carry provenance metadata.
- Publication follows the architecture state machine with guarded transitions.

## Security

- Secrets only in environment variables / secret stores.
- Never commit `.env` files with real credentials.
- Treat discovered content and AI output as untrusted.
- Agents never receive database credentials.

## Git and milestones

- Small, verifiable milestones.
- Do not start the next milestone until acceptance criteria pass.
- Document architecture deviations in `docs/decisions/` first.
