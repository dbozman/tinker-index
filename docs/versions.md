# Locked dependency versions

Documented as of Milestone 2a (2026-11-16). Exact resolved versions live in `pnpm-lock.yaml`.

| Package / runtime | Selected version | Notes |
|---|---|---|
| Node.js | 24 LTS (`^24.0.0`) | Angular 21 does not list Node 26 support |
| pnpm | 10.33.4 | Declared via `packageManager` |
| TypeScript | ~5.9.3 | Required by Angular 21 (`>=5.9 <6`) |
| Angular | 21.2.x | Hybrid SSR/SSG via `@angular/ssr` |
| NestJS | 12.5.x | See ADR 0001 (architecture listed 11) |
| Prisma | 7.10.x | See ADR 0002; `@prisma/adapter-pg` + `pg` |
| PostgreSQL | 16 (Docker Compose) | Local development database |
| Vitest | 4.x | Unit tests for web, api, and worker (NestJS 12 ESM-friendly) |
| ESLint | 9.x | Flat config |
| Prettier | 3.x | Root formatting |

## Peer dependency note

`@nestjs/schematics@12` currently declares a peer on `typescript@>=6`. The workspace stays on TypeScript 5.9 for Angular 21 compatibility. Builds and CLI usage are validated with 5.9; revisit when Angular supports TypeScript 6.

## Related ADRs

- [`decisions/0001-nestjs-12.md`](decisions/0001-nestjs-12.md)
- [`decisions/0002-prisma-7.md`](decisions/0002-prisma-7.md)
- [`decisions/0003-vitest-for-nestjs.md`](decisions/0003-vitest-for-nestjs.md)
