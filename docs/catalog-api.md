# Catalog API (Milestone 2b)

Public read-only NestJS endpoints for the DIY project catalog.

Base path: `/api/v1`  
OpenAPI UI (local): `http://localhost:3000/api/docs`

## Data model (MVP)

```text
Category 1---* Project *---1 Source
                 |  \
                 |   *---? Creator
                 |
                 +---* Tag (via ProjectTag)
                 +---* Tool (via ProjectTool)
                 +---* Material (via ProjectMaterial)
```

Key fields on `Project`:

- Unique SEO slug
- `status` publication state machine (public APIs expose `PUBLISHED` only)
- Difficulty / cost (cents) / duration (minutes) with per-field `Provenance`
- `searchText` for PostgreSQL full-text search
- `isDemo` for seed/demo records
- Optional media attribution placeholders (no R2 yet)

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/projects` | Paginated published projects |
| GET | `/projects/:slug` | Published project detail |
| GET | `/categories` | Categories with published counts |
| GET | `/categories/:slug` | Category + paginated published projects |
| GET | `/search` | Keyword + structured filters |

### Pagination

Query params:

- `page` (default `1`)
- `pageSize` (default `12`, max `50`)

Response meta:

```json
{
  "page": 1,
  "pageSize": 12,
  "totalItems": 42,
  "totalPages": 4
}
```

### Search / filter (`GET /search`)

| Param | Meaning |
|---|---|
| `q` | Keyword full-text query |
| `category` | Category slug |
| `difficulty` | `BEGINNER` \| `INTERMEDIATE` \| `ADVANCED` \| `EXPERT` |
| `minCostCents` / `maxCostCents` | Cost bounds |
| `maxMinutes` | Maximum estimated duration |
| `tools` | Comma-separated tool slugs (AND) |
| `sort` | See sorting |

### Sorting

- `publishedAt_desc` (default)
- `title_asc`
- `estimatedCost_asc` / `estimatedCost_desc`
- `estimatedMinutes_asc` / `estimatedMinutes_desc`

Secondary sort is always `slug asc` for stable pagination.

## Local verification

```bash
pnpm db:tunnel
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev:api
```

Examples:

```bash
curl 'http://localhost:3000/api/v1/projects?page=1&pageSize=5'
curl 'http://localhost:3000/api/v1/projects/demo-led-shelf-lighting'
curl 'http://localhost:3000/api/v1/categories'
curl 'http://localhost:3000/api/v1/search?q=ESP32&category=electronics'
```

Draft demo slug `demo-draft-router-table-fence` must return `404` on public endpoints.
