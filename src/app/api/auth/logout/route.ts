import { NextResponse } from 'next/server'
import { clearedSessionCookie, SESSION_COOKIE } from '@/lib/server/session'

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out successfully.' })
  /* Cleared with the same attributes it was set with. A cookie overwritten with
     a different secure/sameSite pairing is not reliably replaced — the browser
     can keep treating the original as a separate cookie and stay signed in. */
  res.cookies.set(SESSION_COOKIE, '', clearedSessionCookie())
  return res
}
