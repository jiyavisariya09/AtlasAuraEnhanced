import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId, serverError, unauthorized } from '@/lib/server/session'
import { parseBody, reviewSchema } from '@/lib/server/validation'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const destinationId = searchParams.get('destinationId')

    const reviews = await prisma.review.findMany({
      where: destinationId ? { destinationId } : {},
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
  } catch (err) {
    return serverError('Reviews GET error', err, 'Could not load reviews.')
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return unauthorized()

    const parsed = await parseBody(req, reviewSchema)
    if (!parsed.ok) return parsed.response
    const { destinationId, rating, content } = parsed.data

    /* Checked before the write. Prisma's referential action on a bad
       destinationId surfaces as a 500, which reads to the caller as "the server
       is broken" rather than "that place doesn't exist". */
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
      select: { id: true },
    })
    if (!destination) {
      return NextResponse.json({ message: 'That destination does not exist.' }, { status: 404 })
    }

    const review = await prisma.review.create({
      data: {
        destinationId,
        /* From the cookie. A caller cannot post a review as someone else. */
        userId,
        rating,
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
  } catch (err) {
    return serverError('Reviews POST error', err, 'Could not post that review.')
  }
}
