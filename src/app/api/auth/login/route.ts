import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/server/jwt'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60,
  path: '/',
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        badges: true,
        preference: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 })
    }

    // Increment streak / update activity
    await prisma.user.update({
      where: { id: user.id },
      data: {
        streakDays: { increment: 1 },
      },
    }).catch(() => {})

    const token = signToken({ id: user.id, name: user.name, email: user.email })

    const sanitizedUser = {
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
    }

    const res = NextResponse.json({
      message: 'Logged in successfully.',
      user: sanitizedUser,
    })

    res.cookies.set('token', token, COOKIE_OPTS)
    return res
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ message: err.message || 'Failed to login.' }, { status: 500 })
  }
}
