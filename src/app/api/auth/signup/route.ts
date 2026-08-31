import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/server/jwt'
import { sessionCookieOptions } from '@/lib/server/session'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/server/rate-limit'
import { parseBody, signupSchema } from '@/lib/server/validation'
import { verifyOtp } from '@/lib/server/otp'

const SIGNUPS_PER_IP = 6
const WINDOW_MS = 60 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(`signup:${clientKey(req)}`, SIGNUPS_PER_IP, WINDOW_MS)
    if (!limited.allowed) {
      return tooManyRequests(limited.retryAfter, 'Too many accounts created from here. Try again later.')
    }

    const parsed = await parseBody(req, signupSchema)
    if (!parsed.ok) return parsed.response
    const { name, email, phone, password, otp } = parsed.data

    // Check if email already registered
    const exists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (exists) {
      return NextResponse.json({ message: 'Email already registered. Please sign in.' }, { status: 409 })
    }

    // Verify OTP
    const isValidOtp = await verifyOtp({
      email,
      otp,
      purpose: 'signup',
    })

    if (!isValidOtp) {
      return NextResponse.json(
        { message: 'Invalid or expired 6-digit verification code. Please request a new code.' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        avatar: '/avatars/avatar-default.jpg',
        countriesExplored: 0,
        contributionScore: 100, // starting explorer bonus
        streakDays: 1,
        preference: {
          create: {
            preferredCurrency: 'INR',
            savedDestinations: [],
            wishlist: [],
            recentSearches: [],
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        countriesExplored: true,
        contributionScore: true,
        streakDays: true,
        createdAt: true,
      },
    })

    // Award First Explorer badge
    await prisma.userBadge.create({
      data: {
        userId: user.id,
        badgeKey: 'newcomer',
        name: 'Welcome Wanderer',
        icon: '🌟',
        description: 'Joined the AtlasAura community',
      },
    }).catch(() => {})

    const token = signToken({ id: user.id, name: user.name, email: user.email })

    const res = NextResponse.json(
      { message: 'Passport verified & account created successfully.', user },
      { status: 201 },
    )

    res.cookies.set('token', token, sessionCookieOptions())
    return res
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ message: 'Could not create your account. Try again.' }, { status: 500 })
  }
}
