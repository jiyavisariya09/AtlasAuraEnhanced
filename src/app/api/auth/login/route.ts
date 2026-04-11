import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/server/db'
import { User } from '@/lib/server/userModel'
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

    await connectDB()

    const user = await User.findOne({ email }).select('+password')
    if (!user) return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 })

    const match = await user.comparePassword(password)
    if (!match) return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 })

    const token = signToken({ id: user._id, name: user.name, email: user.email })

    const res = NextResponse.json({
      message: 'Logged in successfully.',
      user: { id: user._id, name: user.name, email: user.email },
    })

    res.cookies.set('token', token, COOKIE_OPTS)
    return res
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
