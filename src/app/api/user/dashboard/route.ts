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

    // If logged in, fetch user specific dashboard data; otherwise return demo data from seed
    let user = null
    if (id) {
      user = await prisma.user.findUnique({
        where: { id },
        include: {
          badges: true,
          preference: true,
          pins: {
            orderBy: { createdAt: 'desc' },
            take: 6,
          },
          tripPlans: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
          journals: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      })
    }

    // If no logged in user, fetch demo profile (e.g. Alex Wanderer)
    if (!user) {
      user = await prisma.user.findFirst({
        where: { email: 'alex@atlasaura.com' },
        include: {
          badges: true,
          preference: true,
          pins: {
            orderBy: { createdAt: 'desc' },
            take: 6,
          },
          tripPlans: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
          journals: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      })
    }

    // Fetch popular/trending destinations
    const trendingDestinations = await prisma.destination.findMany({
      orderBy: { rating: 'desc' },
      take: 4,
      include: {
        culturalInfo: true,
      },
    })

    // Fetch hidden gems
    const gems = await prisma.hiddenGem.findMany({
      orderBy: { rating: 'desc' },
      take: 3,
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })

    // All available badges in the system
    const allBadges = [
      { badgeKey: 'newcomer', name: 'Welcome Wanderer', icon: '🌟', description: 'Joined the AtlasAura community' },
      { badgeKey: 'first_pin', name: 'First Memory', icon: '📍', description: 'Dropped your first memory pin' },
      { badgeKey: 'globe_trotter', name: 'Globe Trotter', icon: '🌍', description: 'Visited 5+ countries' },
      { badgeKey: 'memory_keeper', name: 'Memory Keeper', icon: '📸', description: 'Created 10+ memory pins' },
      { badgeKey: 'gem_finder', name: 'Hidden Gem Hunter', icon: '💎', description: 'Discovered 3+ hidden gems' },
      { badgeKey: 'culture_explorer', name: 'Culture Explorer', icon: '🏛️', description: 'Visited 3+ cultural sites' },
      { badgeKey: 'solo_adventurer', name: 'Solo Adventurer', icon: '🎒', description: 'Completed a solo trip' },
      { badgeKey: 'community_guide', name: 'Community Guide', icon: '📚', description: 'Answered 10+ questions' },
    ]

    const earnedKeys = new Set((user?.badges ?? []).map((b) => b.badgeKey))
    const badgesWithStatus = allBadges.map((b) => ({
      ...b,
      earned: earnedKeys.has(b.badgeKey),
    }))

    return NextResponse.json({
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            travelStyle: user.travelStyle,
            countriesExplored: user.countriesExplored,
            contributionScore: user.contributionScore,
            streakDays: user.streakDays,
            pinsCount: user.pins.length,
            pins: user.pins,
            tripPlans: user.tripPlans,
            journals: user.journals,
            badges: badgesWithStatus,
            preference: user.preference,
          }
        : null,
      trendingDestinations,
      hiddenGems: gems,
    })
  } catch (err: any) {
    console.error('Dashboard GET error:', err)
    return NextResponse.json({ message: err.message || 'Failed to fetch dashboard' }, { status: 500 })
  }
}
