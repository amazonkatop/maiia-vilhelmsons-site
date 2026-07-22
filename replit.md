# Maiia Vilhelmsons

A bilingual (EN/RU) luxury interior design studio website for Maiia Vilhelmsons, serving the Hamptons and Manhattan. Quiet luxury, coastal sophistication.

## Run & Operate

- `pnpm --filter @workspace/maiia run dev` — run the frontend (assigned port via workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, wouter (routing), @tanstack/react-query
- API: Express 5, OpenAPI-first with Orval codegen
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Fonts: Cormorant Garamond (serif headings), Jost (sans body)

## Where things live

- `artifacts/maiia/src/` — React frontend
- `artifacts/api-server/src/routes/` — API route handlers
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/src/generated/` — React Query hooks (generated)
- `lib/api-zod/src/generated/` — Zod validation schemas (generated)
- `lib/db/src/schema/` — Drizzle table definitions
- `artifacts/maiia/public/images/` — AI-generated placeholder images

## Product

**Public site** (bilingual EN/RU at `/en/...` and `/ru/...`):
- Home — hero, featured projects, site stats, services preview, journal preview, CTA
- Portfolio — grid with type/location filters
- Portfolio detail — full project gallery + description
- About — studio story and principal designer bio
- Services — service list and detail pages
- Journal — editorial posts (3 seeded)
- Contact — consultation request form (→ leads table)

**Data entities:** Projects (6 seeded), Services (4 seeded), Journal Posts (3 seeded), Leads

## Architecture decisions

- Bilingual routing via wouter: `/en/...` and `/ru/...` paths, locale stored in React context
- Each entity has `*En` / `*Ru` fields; the frontend picks the right one per locale
- `serializeDates()` helper in API server converts Drizzle `Date` objects to ISO strings before Zod validation
- `/api/projects/featured` route is registered BEFORE `/api/projects/:slug` to avoid slug collision
- Images stored as JSON arrays on projects; `jsonb` type in Postgres

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`
- Drizzle returns `Date` objects for timestamps; route handlers use `serializeDates()` before Zod parsing
- The `/projects/featured` route MUST stay registered before `/projects/:slug` in the router
- To add project images: place files in `artifacts/maiia/public/images/` and update the `images` column in the `projects` table
