import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId } from '@/lib/server/session'

export async function GET(req: NextRequest) {
  try {
    const id = getUserId(req)

    /* Signed out is not an error here — the header calls this on every page to
       decide which nav to draw — so an absent session answers 200 with a null
       user rather than 401. */
    if (!id) return NextResponse.json({ user: null })

    const user = await prisma.user.findUnique({
      where: { id },
      /* Explicit, because `include` returns every scalar on the model and this
         one has a `passwordHash` column. */
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        travelStyle: true,
        dreamDestinations: true,
        countriesExplored: true,
        contributionScore: true,
        streakDays: true,
        createdAt: true,
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

    if (!user) return NextResponse.json({ user: null })

    const { _count, ...rest } = user
    return NextResponse.json({ user: { ...rest, counts: _count } })
  } catch (err) {
    console.error('Session error:', err)
    return NextResponse.json({ user: null })
  }
}
