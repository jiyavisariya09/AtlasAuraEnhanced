import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/server/db'
import { User } from '@/lib/server/userModel'
import { signResetToken } from '@/lib/server/jwt'
import { sendMail, resetHtml } from '@/lib/server/mailer'

const OK = { message: 'If that email exists, a reset link has been sent.' }

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ message: 'Email is required.' }, { status: 400 })

    await connectDB()

    const user = await User.findOne({ email })
    if (!user) return NextResponse.json(OK) // prevent email enumeration

    const token = signResetToken({ id: user._id, purpose: 'reset' })
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    await sendMail(user.email, 'Reset your AtlasAura password', resetHtml(user.name, url))

    return NextResponse.json(OK)
  } catch {
    return NextResponse.json({ message: 'Failed to send reset email. Try again.' }, { status: 500 })
  }
}
