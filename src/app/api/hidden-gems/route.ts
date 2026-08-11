import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/server/jwt'
import { GemType, TravelMood, CrowdLevel } from '@prisma/client'

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
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const mood = searchParams.get('mood')
    const country = searchParams.get('country')
    const search = searchParams.get('search')?.toLowerCase().trim()

    const where: any = {}

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
  } catch (err: any) {
    console.error('Hidden Gems GET error:', err)
    return NextResponse.json({ message: err.message || 'Failed to fetch hidden gems' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, country, region, description, fullDescription, image, type, purposes, costUSD, tips, latitude, longitude } = body

    if (!name || !country || !description) {
      return NextResponse.json({ message: 'Name, country, and description are required' }, { status: 400 })
    }

    const gemType = Object.values(GemType).includes(type) ? (type as GemType) : GemType.nature
    const gemPurposes = Array.isArray(purposes)
      ? purposes.filter((p) => Object.values(TravelMood).includes(p))
      : [TravelMood.adventure]

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
        purposes: gemPurposes,
        crowdLevel: CrowdLevel.low,
        cleanlinessScore: 4.8,
        costUSD: costUSD ? parseFloat(costUSD) : 0,
        tips: Array.isArray(tips) ? tips : ['Visit early in the morning to avoid crowds'],
        rating: 5.0,
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
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
  } catch (err: any) {
    console.error('Hidden Gems POST error:', err)
    return NextResponse.json({ message: err.message || 'Failed to submit hidden gem' }, { status: 500 })
  }
}
