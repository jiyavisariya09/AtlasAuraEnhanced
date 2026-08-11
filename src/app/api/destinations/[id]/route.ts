import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        culturalInfo: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!destination) {
      return NextResponse.json({ message: 'Destination not found' }, { status: 404 })
    }

    return NextResponse.json({ destination })
  } catch (err: any) {
    console.error('Destination by ID error:', err)
    return NextResponse.json({ message: err.message || 'Failed to fetch destination' }, { status: 500 })
  }
}
