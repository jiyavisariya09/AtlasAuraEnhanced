import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/server/db'
import { User } from '@/lib/server/userModel'
import { verifyToken } from '@/lib/server/jwt'

function getUserId(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  try {
    const payload = verifyToken(token)
    return payload.id as string
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const id = getUserId(req)
  if (!id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const user = await User.findById(id).select('-password')
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

  return NextResponse.json({
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    bio: user.bio,
    travelStyle: user.travelStyle ?? [],
    dreamDestinations: user.dreamDestinations ?? '',
    joinedAt: user.joinedAt,
  })
}

export async function PUT(req: NextRequest) {
  const id = getUserId(req)
  if (!id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { avatar, bio, travelStyle, dreamDestinations } = body

  await connectDB()
  const user = await User.findByIdAndUpdate(
    id,
    { avatar, bio, travelStyle, dreamDestinations },
    { new: true, select: '-password' }
  )

  return NextResponse.json({ message: 'Profile updated', user })
}
