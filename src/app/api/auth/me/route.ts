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
    if (!id) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        badges: true,
        preference: true,
        _count: {
          select: {
            pins: true,
            gems: true,
            tripPlans: true,
            journals: true,
            answers: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
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
        counts: user._count,
      },
    })
  } catch (err: any) {
    console.error('Session error:', err)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
