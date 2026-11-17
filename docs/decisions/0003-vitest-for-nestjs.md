# ADR 0003 — Use Vitest for NestJS unit tests

- **Status:** Accepted
- **Date:** 2026-11-15
- **Milestone:** M1

## Context

Architecture allows “Vitest and/or Jest” selected per framework integration. NestJS 12 ships ESM-only core packages. Jest 30 can load them on Node 24.9+ only with `--experimental-vm-modules`, and Nest’s migration guidance now treats Vitest as the primary default for ESM workflows.

## Decision

Use **Vitest** for `apps/api` and `apps/worker` unit tests (and optional API e2e config), matching `apps/web`.

## Consequences

- One unit-test runner family across the monorepo.
- Avoids experimental Node/Jest ESM flags in CI.
- Supertest remains available for HTTP e2e tests under Vitest.
