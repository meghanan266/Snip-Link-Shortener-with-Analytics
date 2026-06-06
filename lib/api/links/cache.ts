/*
 * Why we cache an object instead of just the URL:
 *   Middleware must make redirect decisions (password check, expiry check) without
 *   hitting MySQL on every request. Storing { url, password, expiresAt } means
 *   middleware can handle all three cases from Redis alone.
 *
 * Cache key format: "linkcache:{slug}"
 *   Slugs are unique across the app, so a single-segment key is sufficient.
 *   Dub uses "linkcache:{domain}:{key}" because it supports multiple domains;
 *   Snip is single-domain, so we omit the domain segment.
 *
 * On a cache miss:
 *   middleware falls back to a MySQL query via Prisma, then populates the cache
 *   so subsequent requests are served from Redis.
 */

import { redis } from "@/lib/redis"

type CachedLink = {
  url: string
  password: string | null
  expiresAt: string | null
}

const CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds

function cacheKey(slug: string): string {
  return `linkcache:${slug}`
}

export const linkCache = {
  async get(slug: string): Promise<CachedLink | null> {
    return redis.get<CachedLink>(cacheKey(slug))
  },

  async set(link: {
    slug: string
    url: string
    password?: string | null
    expiresAt?: Date | string | null
  }): Promise<void> {
    const value: CachedLink = {
      url: link.url,
      password: link.password ?? null,
      expiresAt: link.expiresAt ? new Date(link.expiresAt).toISOString() : null,
    }
    await redis.set(cacheKey(link.slug), value, { ex: CACHE_TTL })
  },

  // MUST be called whenever a Link is deleted from the DB.
  // Forgetting this causes stale redirects — deleted links keep working
  // because middleware continues to serve the cached entry.
  async delete(slug: string): Promise<void> {
    await redis.del(cacheKey(slug))
  },
}
