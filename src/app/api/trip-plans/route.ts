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
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ tripPlans: [] })

    const tripPlans = await prisma.tripPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ tripPlans })
  } catch (err: any) {
    console.error('TripPlans GET error:', err)
    return NextResponse.json({ message: err.message || 'Failed to fetch trip plans' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, destination, startDate, endDate, budgetUSD, itineraryDays, checklist } = body

    if (!title || !destination) {
      return NextResponse.json({ message: 'Title and destination are required' }, { status: 400 })
    }

    const defaultChecklist = checklist || [
      { id: '1', item: 'Passport & Visa Documents', done: false },
      { id: '2', item: 'Power adapter & charger', done: false },
      { id: '3', item: 'Local currency cash', done: false },
      { id: '4', item: 'Comfortable walking shoes', done: false },
      { id: '5', item: 'Travel insurance copy', done: false },
    ]

    const defaultItinerary = itineraryDays || [
      { day: 1, title: 'Arrival & Check-in', activities: ['Hotel check-in', 'Explore local cafes'] },
      { day: 2, title: 'Main Landmarks', activities: ['Sightseeing tour', 'Traditional dinner'] },
    ]

    const tripPlan = await prisma.tripPlan.create({
      data: {
        userId,
        title,
        destination,
        startDate: startDate || null,
        endDate: endDate || null,
        budgetUSD: budgetUSD ? parseFloat(budgetUSD) : 500,
        itineraryDays: defaultItinerary,
        checklist: defaultChecklist,
      },
    })

    return NextResponse.json({ message: 'Trip plan created successfully', tripPlan }, { status: 201 })
  } catch (err: any) {
    console.error('TripPlans POST error:', err)
    return NextResponse.json({ message: err.message || 'Failed to create trip plan' }, { status: 500 })
  }
}
