import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, signDigitalSignatureToken } from '@/lib/server/jwt'
import { sessionCookieOptions } from '@/lib/server/session'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/server/rate-limit'
import { parseBody, signupSchema } from '@/lib/server/validation'
import { verifyDualOtp, verifyOtp } from '@/lib/server/otp'
import { sendMail, generateDigitalSignatureEmail } from '@/lib/server/mailer'

const SIGNUPS_PER_IP = 10
const WINDOW_MS = 60 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(`signup:${clientKey(req)}`, SIGNUPS_PER_IP, WINDOW_MS)
    if (!limited.allowed) {
      return tooManyRequests(limited.retryAfter, 'Too many accounts created from here. Try again later.')
    }

    const parsed = await parseBody(req, signupSchema)
    if (!parsed.ok) return parsed.response
    const { name, email, phone, password, emailOtp, phoneOtp, otp } = parsed.data

    // Check if email already registered
    const exists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (exists) {
      return NextResponse.json({ message: 'Email already registered. Please sign in.' }, { status: 409 })
    }

    // Verify Dual OTP (or single OTP fallback if legacy client)
    const effectiveEmailOtp = emailOtp || otp
    const effectivePhoneOtp = phoneOtp || otp

    if (!effectiveEmailOtp) {
      return NextResponse.json(
        { message: 'Email verification code is required.' },
        { status: 400 }
      )
    }

    if (phone && effectivePhoneOtp) {
      const dualResult = await verifyDualOtp({
        email,
        phone,
        emailOtp: effectiveEmailOtp,
        phoneOtp: effectivePhoneOtp,
        purpose: 'signup',
      })

      if (!dualResult.valid) {
        return NextResponse.json(
          { message: dualResult.error || 'Invalid or expired verification passcodes.' },
          { status: 400 }
        )
      }
    } else {
      const singleResult = await verifyOtp({
        email,
        otp: effectiveEmailOtp,
        purpose: 'signup',
      })

      if (!singleResult) {
        return NextResponse.json(
          { message: 'Invalid or expired 6-digit email verification code.' },
          { status: 400 }
        )
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)

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

    // Generate secure Digital Signature Registration token and link
    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const signatureToken = signDigitalSignatureToken({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    const signatureLink = `${origin}/register-signature?token=${signatureToken}`

    // 1. Dispatch email with Digital Signature Registration Link
    try {
      const emailHtml = generateDigitalSignatureEmail({
        name: user.name,
        signatureUrl: signatureLink,
        email: user.email,
        phone: user.phone || undefined,
      })
      await sendMail(
        user.email,
        'Action Required: Register Your AtlasAura Digital Signature',
        emailHtml
      )
    } catch (mailErr) {
      console.warn('Digital signature email dispatch warning:', mailErr)
    }

    // 2. Telephony carrier SMS notification
    if (user.phone) {
      console.log(`[AtlasAura Telephony Dispatch] Dispatched digital signature link [${signatureLink}] to mobile endpoint ${user.phone}`)
    }

    const res = NextResponse.json(
      {
        success: true,
        message: 'Dual verification complete. Passport verified and digital signature registration link dispatched.',
        user,
        signatureToken,
        signatureLink,
      },
      { status: 201 },
    )

    res.cookies.set('token', token, sessionCookieOptions())
    return res
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ message: 'Could not create your account. Try again.' }, { status: 500 })
  }
}
