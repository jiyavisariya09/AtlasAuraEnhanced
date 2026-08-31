import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createAndSendOtp, verifyOtp } from '@/lib/server/otp'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/server/rate-limit'

const REQUESTS_PER_IP = 6
const WINDOW_MS = 15 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(`forgot:${clientKey(req)}`, REQUESTS_PER_IP, WINDOW_MS)
    if (!limited.allowed) {
      return tooManyRequests(limited.retryAfter, 'Too many reset requests. Try again shortly.')
    }

    const body = await req.json().catch(() => null)
    if (!body || !body.email) {
      return NextResponse.json({ message: 'Valid email is required.' }, { status: 400 })
    }

    const email = String(body.email).toLowerCase().trim()

    // ── CASE 1: Resetting password with verified OTP ───────────────────────
    if (body.otp && body.newPassword) {
      const otp = String(body.otp).trim()
      const newPassword = String(body.newPassword)

      if (newPassword.length < 8) {
        return NextResponse.json(
          { message: 'New password must be at least 8 characters long.' },
          { status: 400 }
        )
      }

      const isValidOtp = await verifyOtp({
        email,
        otp,
        purpose: 'forgot_password',
      })

      if (!isValidOtp) {
        return NextResponse.json(
          { message: 'Invalid or expired 6-digit reset code. Please request a new code.' },
          { status: 400 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      })

      if (!user) {
        return NextResponse.json(
          { message: 'No registered user found with this email.' },
          { status: 404 }
        )
      }

      const passwordHash = await bcrypt.hash(newPassword, 12)
      await prisma.user.update({
        where: { email },
        data: { passwordHash },
      })

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully. You can now sign in with your new credentials.',
      })
    }

    // ── CASE 2: Requesting OTP reset code ──────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'No account found with this email address.' },
        { status: 404 }
      )
    }

    const result = await createAndSendOtp({
      email,
      name: user.name,
      purpose: 'forgot_password',
    })

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to dispatch reset code.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit recovery code has been sent to ${email}.`,
    })
  } catch (err: any) {
    console.error('Forgot password route error:', err)
    return NextResponse.json(
      { message: 'Failed to process password recovery.' },
      { status: 500 }
    )
  }
}
