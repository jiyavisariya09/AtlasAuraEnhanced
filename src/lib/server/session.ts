import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './jwt'

export const SESSION_COOKIE = 'token'

const SESSION_MAX_AGE = 7 * 24 * 60 * 60

/* `secure` used to be keyed on `NODE_ENV === 'production'`, and this project's
   .env pins NODE_ENV to `development` — so a deployment that forgot to change
   that would hand out the session cookie over plain HTTP, where any network in
   between can read it. NODE_ENV is a build-mode switch, not a statement about
   how the app is reached; the app's own public URL is the honest signal.
   Anything that is not localhost-over-http gets a secure cookie. */
function servedOverPlainLocalhost(): boolean {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/.test(url)
}

/**
 * The one definition of the session cookie. Login, signup and logout all read
 * it from here — a cookie cleared with attributes that don't match the ones it
 * was set with is not reliably cleared at all.
 */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: !servedOverPlainLocalhost(),
    sameSite: 'lax' as const,
    maxAge: SESSION_MAX_AGE,
    path: '/',
  }
}

export function clearedSessionCookie() {
  return { ...sessionCookieOptions(), maxAge: 0 }
}

/**
 * The signed-in user's id, or null. Identity comes only from the signature-
 * verified cookie — never from the request body or a query parameter — so a
 * caller cannot name someone else as the author of what they are writing.
 */
export function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    return verifyToken(token, 'session').id
  } catch {
    return null
  }
}

export function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}

/**
 * Logs the real failure and returns a message chosen by us.
 *
 * Every handler used to answer with `err.message`, which is whatever threw:
 * Prisma validation errors quote the offending query, and a connection failure
 * quotes the database URI — credentials included — straight into an HTTP
 * response body. The detail belongs in the server log, where the operator can
 * see it and the caller cannot.
 */
export function serverError(scope: string, err: unknown, message: string) {
  console.error(`${scope}:`, err)
  return NextResponse.json({ message }, { status: 500 })
}
