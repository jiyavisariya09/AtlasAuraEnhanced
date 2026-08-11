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
    const { searchParams } = new URL(req.url)
    const destinationId = searchParams.get('destinationId')

    const where: any = {}
    if (destinationId) {
      where.destinationId = destinationId
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        destination: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reviews, count: reviews.length })
  } catch (err: any) {
    console.error('Reviews GET error:', err)
    return NextResponse.json({ message: err.message || 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { destinationId, rating, content } = await req.json()

    if (!destinationId || !rating || !content) {
      return NextResponse.json({ message: 'Destination ID, rating, and content are required' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        destinationId,
        userId,
        rating: parseFloat(rating),
        content,
        helpfulVotes: 0,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Award contribution score to the reviewer
    await prisma.user.update({
      where: { id: userId },
      data: {
        contributionScore: { increment: 75 },
      },
    })

    return NextResponse.json({ message: 'Review submitted successfully', review }, { status: 201 })
  } catch (err: any) {
    console.error('Reviews POST error:', err)
    return NextResponse.json({ message: err.message || 'Failed to submit review' }, { status: 500 })
  }
}
