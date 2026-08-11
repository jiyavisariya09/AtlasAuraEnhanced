import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signResetToken } from '@/lib/server/jwt'
import { sendMail, resetHtml } from '@/lib/server/mailer'

const OK = { message: 'If that email exists, a reset link has been sent.' }

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ message: 'Email is required.' }, { status: 400 })

    const cleanEmail = email.toLowerCase().trim()
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } })
    if (!user) return NextResponse.json(OK) // prevent email enumeration

    const token = signResetToken({ id: user.id, purpose: 'reset' })
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const url = `${appUrl}/reset-password?token=${token}`

    await sendMail(user.email, 'Reset your AtlasAura password', resetHtml(user.name, url))

    return NextResponse.json(OK)
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ message: 'Failed to send reset email. Try again.' }, { status: 500 })
  }
}
