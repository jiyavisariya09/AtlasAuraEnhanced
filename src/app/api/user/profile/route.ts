import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/server/jwt'

function getUserId(req: NextRequest): string | null {
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
  try {
    const id = getUserId(req)
    if (!id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        badges: true,
        preference: true,
      },
    })

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    return NextResponse.json({
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
      joinedAt: user.createdAt,
      badges: user.badges,
      preference: user.preference,
    })
  } catch (err: any) {
    console.error('Profile GET error:', err)
    return NextResponse.json({ message: err.message || 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = getUserId(req)
    if (!id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, phone, avatar, bio, travelStyle, dreamDestinations } = body

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
        ...(travelStyle !== undefined && { travelStyle }),
        ...(dreamDestinations !== undefined && { dreamDestinations }),
      },
      include: {
        badges: true,
        preference: true,
      },
    })

    return NextResponse.json({ message: 'Profile updated successfully', user })
  } catch (err: any) {
    console.error('Profile PUT error:', err)
    return NextResponse.json({ message: err.message || 'Failed to update profile' }, { status: 500 })
  }
}
