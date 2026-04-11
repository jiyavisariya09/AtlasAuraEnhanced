import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/server/db'
import { User } from '@/lib/server/userModel'
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

    await connectDB()

    const exists = await User.findOne({ email })
    if (exists) return NextResponse.json({ message: 'Email already registered.' }, { status: 409 })

    const user = await User.create({ name, email, phone, password })

    sendMail(user.email, 'Welcome to AtlasAura 🌍', welcomeHtml(user.name)).catch(() => {})

    const token = signToken({ id: user._id, name: user.name, email: user.email })

    const res = NextResponse.json({
      message: 'Account created successfully.',
      user: { id: user._id, name: user.name, email: user.email },
    }, { status: 201 })

    res.cookies.set('token', token, COOKIE_OPTS)
    return res
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
