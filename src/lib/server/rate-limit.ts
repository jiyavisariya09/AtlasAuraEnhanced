/**
 * A small fixed-window rate limiter, kept in this process's memory.
 *
 * What it is for: making credential stuffing and password spraying slow enough
 * to be useless. Before this, `/api/auth/login` would answer as fast as bcrypt
 * could run, forever — which, against seeded accounts that all shared one
 * password, is all an attacker needed.
 *
 * What it is not: a shared limiter. The counters live in one Node process, so
 * they reset on redeploy and each instance counts on its own. On a single
 * long-lived server that is the real thing; spread across serverless instances
 * it becomes "N attempts per instance". If this app is ever deployed that way,
 * move the counters to Redis (Upstash's `@upstash/ratelimit` drops into the
 * same call shape) — the function signature here is deliberately the one you
 * would keep.
 */

interface Window {
  count: number
  resetAt: number
}

const windows = new Map<string, Window>()

/* Bounded so a flood of distinct keys — one per spoofed IP, say — cannot grow
   the map without limit. Expired entries are swept first; if everything is
   still live we drop the whole map rather than let it climb, which briefly
   forgives in-flight offenders but never leaks. */
const MAX_TRACKED_KEYS = 20_000

function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key)
  }
  if (windows.size > MAX_TRACKED_KEYS) windows.clear()
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  /** Seconds until the window resets — the value for a Retry-After header. */
  retryAfter: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  if (windows.size > 512) sweep(now)

  const existing = windows.get(key)

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  existing.count += 1
  const retryAfter = Math.ceil((existing.resetAt - now) / 1000)

  return {
    allowed: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfter,
  }
}

/**
 * Best-effort client address.
 *
 * Worth being honest about: `x-forwarded-for` is a request header, so a caller
 * with no proxy in front of them can put anything in it. Behind a platform that
 * sets these itself (Vercel, Cloudflare, an nginx with `proxy_set_header`) the
 * value is trustworthy; on a bare server it is not, and an attacker can rotate
 * it to reset their own window. That is why the login route also counts
 * attempts per email address, which is the thing being attacked and cannot be
 * rotated away.
 */
export function clientKey(req: Request): string {
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  return 'unknown'
}

export function tooManyRequests(retryAfter: number, message: string) {
  return new Response(JSON.stringify({ message }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(Math.max(1, retryAfter)),
    },
  })
}
