import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId, serverError, unauthorized } from '@/lib/server/session'
import { parseBody, profileUpdateSchema } from '@/lib/server/validation'

/* The shape of a profile as the client is allowed to see it. Named once and
   reused by both handlers, because the two used to disagree: GET listed its
   fields by hand while PUT returned `include`, which on this model means the
   `passwordHash` column travelled back in the update response — and the
   settings page writes that response into localStorage. */
const PROFILE_FIELDS = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  bio: true,
  travelStyle: true,
  dreamDestinations: true,
  countriesExplored: true,
  contributionScore: true,
  streakDays: true,
  createdAt: true,
  badges: true,
  preference: true,
} as const

export async function GET(req: NextRequest) {
  try {
    const id = getUserId(req)
    if (!id) return unauthorized()

    const user = await prisma.user.findUnique({ where: { id }, select: PROFILE_FIELDS })
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    return NextResponse.json({ ...user, joinedAt: user.createdAt })
  } catch (err) {
    return serverError('Profile GET error', err, 'Could not load your profile.')
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = getUserId(req)
    if (!id) return unauthorized()

    const parsed = await parseBody(req, profileUpdateSchema)
    if (!parsed.ok) return parsed.response

    /* Written key by key rather than spread. The schema is already an allow
       list, but building the update this way means adding a field to the schema
       can never quietly make a new column writable — including the ones that
       are supposed to be earned, like contributionScore, or the ones that
       identify the account, like email. */
    const { name, phone, avatar, bio, travelStyle, dreamDestinations } = parsed.data

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
        ...(travelStyle !== undefined && { travelStyle }),
        ...(dreamDestinations !== undefined && { dreamDestinations }),
      },
      select: PROFILE_FIELDS,
    })

    return NextResponse.json({ message: 'Profile updated successfully', user })
  } catch (err) {
    return serverError('Profile PUT error', err, 'Could not save your profile.')
  }
}
