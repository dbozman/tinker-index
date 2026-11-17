# ADR 0002 — Use Prisma 7 for PostgreSQL access

- **Status:** Accepted (install deferred to Milestone 2)
- **Date:** 2026-11-15
- **Milestone:** M1 decision / M2 implementation

## Context

Architecture selects Prisma as the ORM and notes Prisma 7 as a candidate with ESM/adapter considerations, while Prisma 6 remains an alternative if compatibility testing fails.

As of 2026-11-15:

- Prisma 7 is the supported stable SQL ORM line requiring a driver adapter (e.g. `@prisma/adapter-pg`).
- Prisma 6 receives security patches only through 2026-11-19.
- Prisma 8 is release-candidate and must not be used for the initial implementation.

## Decision

Use **Prisma 7** with `@prisma/adapter-pg` when database work begins in Milestone 2. Schema and migrations live under `apps/api`.

## Consequences

- ESM-oriented client generation and explicit adapter wiring are required.
- Node 24 and TypeScript 5.9 satisfy Prisma 7 prerequisites.
- No Prisma packages are installed in Milestone 1.
