import { NextRequest, NextResponse } from 'next/server'

/* Pages that make no sense without an account. Listed as prefixes, so
   /dashboard and /dashboard/anything are both covered. */
const PRIVATE_PREFIXES = ['/dashboard', '/settings', '/trip-planner', '/atlas', '/welcome']

/**
 * What this is, precisely: a redirect. It checks whether a session cookie is
 * *present*, not whether it is valid.
 *
 * It cannot check validity. Middleware runs on the Edge runtime, where
 * `jsonwebtoken` has no Node crypto to call, so verifying the signature here
 * would mean adding `jose` as a dependency. Until that happens, this is a user-
 * experience gate — it saves a signed-out visitor from loading a dashboard that
 * would only bounce them — and every route handler still verifies the signature
 * itself before returning anything. Forging a `token` cookie gets you the
 * dashboard shell and an empty payload, which is what a signed-out visitor sees
 * anyway.
 *
 * Do not add an authorization decision here on the assumption the cookie is
 * trustworthy.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const hasSession = Boolean(req.cookies.get('token')?.value)

  if (!hasSession && PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const signin = new URL('/signin', req.url)
    /* Where they were going, so signing in finishes the journey instead of
       dumping them on the home page. Relative-only by construction — `pathname`
       comes from the parsed URL, so this cannot be turned into an open redirect
       to another host. */
    signin.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(signin)
  }

  /* No matching redirect for the reverse case — sending a cookie-bearing
     visitor away from /signin. It looks tidy and it is a trap: a cookie that is
     present but no longer verifies (an expired session, or one signed before
     the token format changed) would bounce /signin → /dashboard → /signin
     forever, and the person locked in that loop is someone trying to fix it by
     signing in again. The signed-in state is drawn on the page instead. */

  const res = NextResponse.next()

  /* Headers that cost nothing and close off whole classes of attack.
     Deliberately no Content-Security-Policy yet: layout.tsx writes the theme
     before first paint with an inline <script>, and a policy strict enough to be
     worth having would block it. Doing that properly means threading a nonce
     through the layout — worth doing, but it is a change to how the page boots,
     not a header. */
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=()')

  return res
}

export const config = {
  /* Everything except Next's own assets and files served straight from public/.
     Running middleware over static assets is pure latency. */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|webp|svg|ico|mp4|webm|woff2?)$).*)'],
}
