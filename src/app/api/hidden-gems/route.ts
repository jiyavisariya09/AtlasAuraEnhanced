import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GemType, TravelMood, CrowdLevel, Prisma } from '@prisma/client'
import { getUserId, serverError, unauthorized } from '@/lib/server/session'
import { parseBody, gemSchema } from '@/lib/server/validation'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const mood = searchParams.get('mood')
    const country = searchParams.get('country')
    const search = searchParams.get('search')?.toLowerCase().trim()

    /* Typed rather than `any`. With `any` there was nothing stopping a stray key
       reaching Prisma's `where`, and nothing telling us if one was misspelt. */
    const where: Prisma.HiddenGemWhereInput = {}

    if (type && Object.values(GemType).includes(type as GemType)) {
      where.type = type as GemType
    }

    if (mood && Object.values(TravelMood).includes(mood as TravelMood)) {
      where.purposes = { has: mood as TravelMood }
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { keywords: { has: search } },
      ]
    }

    const gems = await prisma.hiddenGem.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json({ gems, count: gems.length })
  } catch (err) {
    return serverError('Hidden Gems GET error', err, 'Could not load hidden gems.')
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return unauthorized()

    const parsed = await parseBody(req, gemSchema)
    if (!parsed.ok) return parsed.response
    const { name, country, region, description, fullDescription, image, type, purposes, costUSD, tips, latitude, longitude } = parsed.data

    const gemType = Object.values(GemType).includes(type as GemType) ? (type as GemType) : GemType.nature
    const gemPurposes = (purposes ?? []).filter((p): p is TravelMood =>
      Object.values(TravelMood).includes(p as TravelMood),
    )

    const newGem = await prisma.hiddenGem.create({
      data: {
        name,
        country,
        region: region || country,
        description,
        fullDescription: fullDescription || description,
        image: image || '/hidden-gem-1.jpg',
        images: [image || '/hidden-gem-1.jpg'],
        type: gemType,
        purposes: gemPurposes.length > 0 ? gemPurposes : [TravelMood.adventure],
        crowdLevel: CrowdLevel.low,
        /* Contributed content starts unrated. These were hard-coded to 4.8 and
           5.0, which meant every new submission arrived as the highest-rated
           gem in the database and went straight to the top of a list ordered by
           rating — a free promotion for anything anyone posted. */
        cleanlinessScore: 0,
        rating: 0,
        costUSD: costUSD ?? 0,
        tips: tips && tips.length > 0 ? tips : ['Visit early in the morning to avoid crowds'],
        latitude: latitude ?? 0,
        longitude: longitude ?? 0,
        keywords: [country.toLowerCase(), name.toLowerCase()],
        authorId: userId,
      },
    })

    // Award contribution points & gem hunter badge
    await prisma.user.update({
      where: { id: userId },
      data: {
        contributionScore: { increment: 150 },
      },
    })

    await prisma.userBadge.create({
      data: {
        userId,
        badgeKey: 'gem_finder',
        name: 'Hidden Gem Hunter',
        icon: '💎',
        description: 'Discovered and contributed a hidden gem to the AtlasAura map',
      },
    }).catch(() => {})

    return NextResponse.json({ message: 'Hidden gem submitted successfully', gem: newGem }, { status: 201 })
  } catch (err) {
    return serverError('Hidden Gems POST error', err, 'Could not submit that gem.')
  }
}
