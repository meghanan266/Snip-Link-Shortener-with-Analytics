---

# Snip — Project Memory for Claude Code

## What This Project Is
Snip is a link shortener with analytics. Users create short links, share them,
and see click analytics (country, device, browser, referrer) in a dashboard.
It is inspired by the open source Dub project (in the sibling /dub folder).

## Tech Stack
- Framework: Next.js 14 App Router
- Language: TypeScript (strict mode, no any types)
- Styling: Tailwind CSS
- ORM: Prisma with MySQL (PlanetScale)
- Cache: Upstash Redis
- Queue: Upstash QStash
- Validation: Zod on all API routes
- Charts: Recharts

## Folder Conventions
- app/api/ — API route handlers only. No business logic here.
- lib/api/links/ — link business logic (process-link.ts, create-link.ts, cache.ts)
- lib/middleware/ — redirect engine (link.ts) and API key auth (with-api-key.ts)
- lib/ — all other shared utilities (redis.ts, prisma.ts, qstash.ts, analytics.ts, etc.)
- components/ — React components only
- prisma/ — schema.prisma only

## Architecture: How Redirects Work
Short link redirects are handled in middleware.ts at the project root.
middleware.ts dispatches to lib/middleware/link.ts (LinkMiddleware function).
LinkMiddleware checks Redis first, then MySQL on cache miss.
Click events are recorded via ev.waitUntil(recordClick()) — async, non-blocking.
This mirrors how the open source Dub project handles redirects.

## Critical Rules — Always Follow These
1. Never put business logic in route handlers (app/api/**). 
   Route handlers call functions from lib/. That is all.
2. Always call linkCache.delete(slug) when deleting a link from the DB.
   Forgetting this causes stale redirects — a real production bug.
3. Always call linkCache.set() after creating or updating a link.
4. Redis cache key format: "linkcache:{slug}"
   Cache stores an object: { url, password, expiresAt } — NOT just the URL string.
   This is because middleware needs password and expiresAt to make decisions without a DB query.
5. All API errors must return this exact shape:
   { error: { code: string, message: string } }
   Never return plain strings or different shapes.
6. All API route inputs must be validated with Zod before any processing.
7. Use ev.waitUntil() for all async work inside middleware (cache writes, click recording).
   Never use void or fire-and-forget in middleware — use ev.waitUntil.

## Dub Reference
The /dub folder is the open source Dub codebase. It is read-only reference material.
Key files to reference:
- dub/apps/web/middleware.ts — how middleware dispatches to LinkMiddleware
- dub/apps/web/lib/middleware/link.ts — the full redirect engine
- dub/apps/web/lib/api/links/cache.ts — how Redis linkCache is structured
- dub/apps/web/lib/api/links/process-link.ts — link validation and preparation
- dub/apps/web/lib/api/links/create-link.ts — DB write + cache write pattern
- dub/packages/prisma/schema/link.prisma — the full Link model for reference

## Commands
- pnpm dev — start dev server
- pnpm build — production build
- pnpm prisma migrate dev — run DB migrations
- pnpm prisma studio — open DB UI

---
