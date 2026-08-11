import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/server/jwt'
import { TravelMood } from '@prisma/client'

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
    
    // If authenticated, get user pins; otherwise get all public pins
    const pins = id
      ? await prisma.memoryPin.findMany({
          where: {
            OR: [
              { userId: id },
              { isPublic: true },
            ],
          },
          orderBy: { createdAt: 'desc' },
        })
      : await prisma.memoryPin.findMany({
          where: { isPublic: true },
          orderBy: { createdAt: 'desc' },
        })

    return NextResponse.json({ pins })
  } catch (err: any) {
    console.error('Pins GET error:', err)
    return NextResponse.json({ pins: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const id = getUserId(req)
    if (!id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { lat, lng, country, note, emoji, image, mood, isPublic } = body

    if (lat === undefined || lng === undefined || !country || !note) {
      return NextResponse.json({ message: 'Missing required pin fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    const validMood = Object.values(TravelMood).includes(mood) ? (mood as TravelMood) : TravelMood.culture

    const newPin = await prisma.memoryPin.create({
      data: {
        lat: Number(lat),
        lng: Number(lng),
        country,
        note,
        emoji: emoji || '📍',
        image: image || null,
        mood: validMood,
        author: user.name,
        date: new Date().toISOString().split('T')[0],
        isPublic: isPublic !== false,
        userId: user.id,
      },
    })

    // Award contribution points & check pin badges
    await prisma.user.update({
      where: { id: user.id },
      data: {
        contributionScore: { increment: 50 },
      },
    })

    const totalPins = await prisma.memoryPin.count({ where: { userId: user.id } })
    if (totalPins >= 1) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeKey: 'first_pin',
          name: 'First Memory',
          icon: '📍',
          description: 'Dropped your first memory pin on the world map',
        },
      }).catch(() => {})
    }

    const pins = await prisma.memoryPin.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ message: 'Pin created successfully', pin: newPin, pins }, { status: 201 })
  } catch (err: any) {
    console.error('Pins POST error:', err)
    return NextResponse.json({ message: err.message || 'Failed to create pin' }, { status: 500 })
  }
}
