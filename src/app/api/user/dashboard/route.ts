import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId, serverError } from '@/lib/server/session'

/* Every badge the system can award. Kept here so the dashboard can show the
   locked ones alongside the earned ones. */
const ALL_BADGES = [
  { badgeKey: 'newcomer', name: 'Welcome Wanderer', icon: '🌟', description: 'Joined the AtlasAura community' },
  { badgeKey: 'first_pin', name: 'First Memory', icon: '📍', description: 'Dropped your first memory pin' },
  { badgeKey: 'globe_trotter', name: 'Globe Trotter', icon: '🌍', description: 'Visited 5+ countries' },
  { badgeKey: 'memory_keeper', name: 'Memory Keeper', icon: '📸', description: 'Created 10+ memory pins' },
  { badgeKey: 'gem_finder', name: 'Hidden Gem Hunter', icon: '💎', description: 'Discovered 3+ hidden gems' },
  { badgeKey: 'culture_explorer', name: 'Culture Explorer', icon: '🏛️', description: 'Visited 3+ cultural sites' },
  { badgeKey: 'solo_adventurer', name: 'Solo Adventurer', icon: '🎒', description: 'Completed a solo trip' },
  { badgeKey: 'community_guide', name: 'Community Guide', icon: '📚', description: "Answered 10+ of the community's questions" },
]

export async function GET(req: NextRequest) {
  try {
    const id = getUserId(req)

    /* An anonymous caller used to be handed the seeded demo account here —
       `prisma.user.findFirst({ where: { email: 'alex@atlasaura.com' } })` — which
       served a real person's email address, memory pins and trip plans to
       anyone who typed the URL. If that account is a colleague rather than a
       fixture, it was a data breach with a convenient endpoint.

       The dashboard is a signed-in page, so a signed-out request now gets the
       public half of the payload and `user: null`; the page redirects on that. */
    const user = id
      ? await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            travelStyle: true,
            countriesExplored: true,
            contributionScore: true,
            streakDays: true,
            createdAt: true,
            preference: true,
            badges: true,
            pins: { orderBy: { createdAt: 'desc' }, take: 6 },
            tripPlans: { orderBy: { createdAt: 'desc' }, take: 3 },
            journals: { orderBy: { createdAt: 'desc' }, take: 3 },
            _count: { select: { pins: true, gems: true, tripPlans: true, journals: true, answers: true } },
          },
        })
      : null

    /* Public either way: these are the same rows the home page already shows,
       so they stay in the response for a signed-out visitor and give the page
       something real to render behind the sign-in prompt. */
    const [trendingDestinations, gems] = await Promise.all([
      prisma.destination.findMany({
        orderBy: { rating: 'desc' },
        take: 4,
        include: { culturalInfo: true },
      }),
      prisma.hiddenGem.findMany({
        orderBy: { rating: 'desc' },
        take: 3,
        include: { author: { select: { name: true, avatar: true } } },
      }),
    ])

    if (!user) {
      return NextResponse.json({ user: null, trendingDestinations, hiddenGems: gems })
    }

    const earned = new Set(user.badges.map((b) => b.badgeKey))
    const { _count, badges: _earnedRows, ...profile } = user

    return NextResponse.json({
      user: {
        ...profile,
        pinsCount: _count.pins,
        counts: _count,
        badges: ALL_BADGES.map((b) => ({ ...b, earned: earned.has(b.badgeKey) })),
      },
      trendingDestinations,
      hiddenGems: gems,
    })
  } catch (err) {
    return serverError('Dashboard GET error', err, 'Could not load your dashboard.')
  }
}
