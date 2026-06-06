import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "@/lib/redis"

// Rate limiter for the redirect engine
// 100 requests per minute per IP address
// Protects against link scraping and automated abuse
export const redirectLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  prefix: "snip:redirect",
  analytics: false,
})

// Rate limiter for API routes
// 60 requests per minute per API key
// Protects against API abuse and runaway scripts
export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  prefix: "snip:api",
  analytics: false,
})
