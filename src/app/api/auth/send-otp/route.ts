import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAndSendOtp } from '@/lib/server/otp'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/server/rate-limit'

const REQUESTS_PER_IP = 6
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(`send-otp:${clientKey(req)}`, REQUESTS_PER_IP, WINDOW_MS)
    if (!limited.allowed) {
      return tooManyRequests(limited.retryAfter, 'Too many verification code requests. Please wait a few minutes.')
    }

    const body = await req.json().catch(() => null)
    if (!body || !body.email || typeof body.email !== 'string') {
      return NextResponse.json({ message: 'Valid email address is required.' }, { status: 400 })
    }

    const email = body.email.toLowerCase().trim()
    const name = typeof body.name === 'string' ? body.name.trim() : undefined
    const purpose = body.purpose === 'forgot_password' ? 'forgot_password' : 'signup'

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email address format.' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    })

    if (purpose === 'signup' && existingUser) {
      return NextResponse.json(
        { message: 'This email is already registered. Please sign in instead.' },
        { status: 409 }
      )
    }

    if (purpose === 'forgot_password' && !existingUser) {
      return NextResponse.json(
        { message: 'No registered explorer found with this email address.' },
        { status: 404 }
      )
    }

    const recipientName = name || existingUser?.name || 'Traveler'

    const result = await createAndSendOtp({
      email,
      name: recipientName,
      purpose,
    })

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to dispatch verification code.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code was sent to ${email}.`,
    })
  } catch (err: any) {
    console.error('Send OTP route error:', err)
    return NextResponse.json(
      { message: 'Internal server error while sending verification code.' },
      { status: 500 }
    )
  }
}
