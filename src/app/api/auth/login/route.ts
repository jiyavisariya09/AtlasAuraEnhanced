import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/server/jwt'
import { sessionCookieOptions } from '@/lib/server/session'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/server/rate-limit'
import { loginSchema, parseBody } from '@/lib/server/validation'

/* Two counters, because they defeat different attacks. The per-address one
   stops one machine working through a password list; the per-email one stops a
   botnet spread across many addresses working on one account. An attacker who
   can rotate `x-forwarded-for` still runs into the second. */
const ATTEMPTS_PER_IP = 10
const ATTEMPTS_PER_EMAIL = 5
const WINDOW_MS = 10 * 60 * 1000

const THROTTLED = 'Too many sign-in attempts. Wait a few minutes and try again.'

/* One message for "no such account" and for "wrong password", because
   distinguishing them tells a caller which email addresses are registered. */
const REJECTED = 'Invalid email or password.'

/* A real hash of a value nobody knows, used to make the "no such user" path
   cost the same bcrypt round as the "wrong password" path. Generated rather
   than hard-coded because bcryptjs returns false immediately for a malformed
   hash string — a fake one would defeat the very timing equalisation it was
   there to provide. Memoised, so only the first miss pays for it. */
let decoyHash: Promise<string> | null = null
function decoy() {
  if (!decoyHash) decoyHash = bcrypt.hash(randomUUID(), 12)
  return decoyHash
}

export async function POST(req: NextRequest) {
  try {
    const byIp = rateLimit(`login:ip:${clientKey(req)}`, ATTEMPTS_PER_IP, WINDOW_MS)
    if (!byIp.allowed) return tooManyRequests(byIp.retryAfter, THROTTLED)

    const parsed = await parseBody(req, loginSchema)
    if (!parsed.ok) return parsed.response
    const { email, password } = parsed.data

    const byEmail = rateLimit(`login:email:${email}`, ATTEMPTS_PER_EMAIL, WINDOW_MS)
    if (!byEmail.allowed) return tooManyRequests(byEmail.retryAfter, THROTTLED)

    const user = await prisma.user.findUnique({
      where: { email },
      include: { badges: true, preference: true },
    })

    /* Compared even when there is no such user. Returning early on a missing
       account makes the response measurably faster than a wrong password does,
       and that timing difference is a working account-enumeration oracle. */
    const hash = user?.passwordHash ?? (await decoy())
    const match = await bcrypt.compare(password, hash)

    if (!user || !match) {
      return NextResponse.json({ message: REJECTED }, { status: 401 })
    }

    /* Was `streakDays: { increment: 1 }` — which counted sign-ins, not days, so
       signing in three times in one afternoon read as a three-day streak. The
       real thing needs a stored last-active date; until the dashboard work adds
       one, not lying is better than counting the wrong thing. */

    const token = signToken({ id: user.id, name: user.name, email: user.email })

    const res = NextResponse.json({
      message: 'Logged in successfully.',
      /* Field-by-field, not the whole record: `user` also carries
         `passwordHash`, and spreading it here is how hashes end up in a
         response body and then in localStorage. */
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
        travelStyle: user.travelStyle,
        dreamDestinations: user.dreamDestinations,
        countriesExplored: user.countriesExplored,
        contributionScore: user.contributionScore,
        streakDays: user.streakDays,
        createdAt: user.createdAt,
        badges: user.badges,
        preference: user.preference,
      },
    })

    res.cookies.set('token', token, sessionCookieOptions())
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ message: 'Could not sign you in. Try again.' }, { status: 500 })
  }
}
