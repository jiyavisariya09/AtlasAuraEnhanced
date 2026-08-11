import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/server/jwt'
import { sendMail, welcomeHtml } from '@/lib/server/mailer'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60,
  path: '/',
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password are required.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    const exists = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (exists) {
      return NextResponse.json({ message: 'Email already registered.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone || null,
        passwordHash,
        avatar: '/avatars/avatar-default.jpg',
        countriesExplored: 0,
        contributionScore: 100, // starting explorer bonus
        streakDays: 1,
        preference: {
          create: {
            preferredCurrency: 'USD',
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

    sendMail(user.email, 'Welcome to AtlasAura 🌍', welcomeHtml(user.name)).catch(() => {})

    const token = signToken({ id: user.id, name: user.name, email: user.email })

    const res = NextResponse.json(
      {
        message: 'Account created successfully.',
        user,
      },
      { status: 201 }
    )

    res.cookies.set('token', token, COOKIE_OPTS)
    return res
  } catch (err: any) {
    console.error('Signup error:', err)
    return NextResponse.json({ message: err.message || 'Failed to create account.' }, { status: 500 })
  }
}
