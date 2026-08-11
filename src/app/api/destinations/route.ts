import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TravelMood, CrowdLevel } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.toLowerCase().trim()
    const region = searchParams.get('region')
    const mood = searchParams.get('mood')
    const maxBudget = searchParams.get('maxBudget')
    const crowdLevel = searchParams.get('crowdLevel')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (region && region !== 'all') {
      where.region = { equals: region, mode: 'insensitive' }
    }

    if (mood && mood !== 'all' && Object.values(TravelMood).includes(mood as TravelMood)) {
      where.purposes = { has: mood as TravelMood }
    }

    if (maxBudget) {
      const budgetNum = parseFloat(maxBudget)
      if (!isNaN(budgetNum)) {
        where.budgetUSD = { lte: budgetNum }
      }
    }

    if (crowdLevel && Object.values(CrowdLevel).includes(crowdLevel as CrowdLevel)) {
      where.crowdLevel = crowdLevel as CrowdLevel
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        culturalInfo: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json({ destinations, count: destinations.length })
  } catch (err: any) {
    console.error('Destinations GET error:', err)
    return NextResponse.json({ message: err.message || 'Failed to fetch destinations' }, { status: 500 })
  }
}
