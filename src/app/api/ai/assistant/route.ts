import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TravelMood, Prisma } from '@prisma/client'
import { serverError } from '@/lib/server/session'

export async function POST(req: NextRequest) {
  try {
    const { prompt, mood, maxBudget, durationDays, interests } = await req.json()

    // Query destinations matching criteria
    const where: Prisma.DestinationWhereInput = {}

    if (mood && Object.values(TravelMood).includes(mood as TravelMood)) {
      where.purposes = { has: mood as TravelMood }
    }

    if (maxBudget && !isNaN(parseFloat(maxBudget))) {
      where.budgetUSD = { lte: parseFloat(maxBudget) }
    }

    let destinations = await prisma.destination.findMany({
      where,
      include: {
        culturalInfo: true,
      },
      take: 3,
    })

    // If filter is too strict, fallback to top destinations
    if (destinations.length === 0) {
      destinations = await prisma.destination.findMany({
        take: 3,
        include: {
          culturalInfo: true,
        },
      })
    }

    // Generate intelligent AI recommendations & itinerary breakdown
    const recommendations = destinations.map((d) => ({
      id: d.id,
      name: d.name,
      country: d.country,
      description: d.description,
      image: d.image,
      rating: d.rating,
      budgetUSD: d.budgetUSD,
      bestTimeToVisit: d.bestTimeToVisit,
      highlights: d.mustVisit,
      safetyTips: d.etiquette,
      foodRecommendations: d.foodTips,
      culturalInsight: d.culturalInfo
        ? {
            traditions: d.culturalInfo.traditions,
            festivals: d.culturalInfo.festivals,
            dos: d.culturalInfo.dos,
            donts: d.culturalInfo.donts,
          }
        : null,
      suggestedItinerary: [
        { day: 1, title: 'Arrival & Cultural Immersion', activities: [`Explore local neighborhoods`, `Try ${d.foodTips[0] || 'local dishes'}`] },
        { day: 2, title: 'Landmarks & Heritage', activities: [`Visit ${d.mustVisit[0] || 'historic center'}`, `Sunset viewpoint`] },
        { day: 3, title: 'Off-the-beaten-path Adventure', activities: [`Visit ${d.mustVisit[1] || 'scenic trail'}`, `Local market walk`] },
      ],
    }))

    const aiResponse = {
      query: prompt || 'Personalized travel suggestions',
      mood: mood || 'all',
      recommendations,
      travelTips: [
        'Always keep offline digital copies of your passport and visas.',
        'Exchange a small amount of local currency upon arrival for immediate transit.',
        'Respect local dress codes when visiting temples and sacred landmarks.',
      ],
    }

    return NextResponse.json(aiResponse)
  } catch (err) {
    return serverError('AI Assistant error', err, 'Could not put together recommendations right now.')
  }
}
