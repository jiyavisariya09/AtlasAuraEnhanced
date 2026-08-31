import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TravelMood } from '@prisma/client'
import { getUserId, serverError, unauthorized } from '@/lib/server/session'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/server/rate-limit'
import { parseBody, pinSchema } from '@/lib/server/validation'

const PINS_PER_HOUR = 40

export async function GET(req: NextRequest) {
  try {
    const id = getUserId(req)

    const pins = await prisma.memoryPin.findMany({
      /* Signed in: your own pins plus everyone's public ones. Signed out:
         public only. Note this is a read of already-public content — the pin
         author's name is stored on the pin itself, not joined from User, so no
         email address rides along. */
      where: id ? { OR: [{ userId: id }, { isPublic: true }] } : { isPublic: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ pins })
  } catch (err) {
    console.error('Pins GET error:', err)
    return NextResponse.json({ pins: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const id = getUserId(req)
    if (!id) return unauthorized()

    const limited = rateLimit(`pins:${id}`, PINS_PER_HOUR, 60 * 60 * 1000)
    if (!limited.allowed) {
      return tooManyRequests(limited.retryAfter, 'That is a lot of pins at once. Try again a little later.')
    }

    const parsed = await parseBody(req, pinSchema)
    if (!parsed.ok) return parsed.response
    const { lat, lng, country, note, emoji, image, mood, isPublic } = parsed.data

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true } })
    if (!user) return unauthorized()

    const validMood = Object.values(TravelMood).includes(mood as TravelMood)
      ? (mood as TravelMood)
      : TravelMood.culture

    const pin = await prisma.memoryPin.create({
      data: {
        lat,
        lng,
        country,
        note,
        emoji: emoji || '📍',
        image: image || null,
        mood: validMood,
        /* From the verified session, not from the body. The author of a pin is
           whoever is holding the cookie. */
        author: user.name,
        date: new Date().toISOString().split('T')[0],
        isPublic: isPublic !== false,
        userId: user.id,
      },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { contributionScore: { increment: 50 } },
    })

    /* First pin only. This ran on every pin before and leaned on the unique
       index throwing to stay idempotent, which meant a caught error was part of
       normal operation and the log filled with failures that were not failures. */
    const totalPins = await prisma.memoryPin.count({ where: { userId: user.id } })
    if (totalPins === 1) {
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

    return NextResponse.json({ message: 'Pin created successfully', pin, pins }, { status: 201 })
  } catch (err) {
    return serverError('Pins POST error', err, 'Could not save that pin.')
  }
}
