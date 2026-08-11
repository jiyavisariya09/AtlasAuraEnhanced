import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/server/db'
import { User } from '@/lib/server/userModel'
import { verifyToken } from '@/lib/server/jwt'

function getUserId(req: NextRequest) {
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
  const id = getUserId(req)
  if (!id) return NextResponse.json({ pins: [] })

  await connectDB()
  const user = await User.findById(id).select('pins')
  return NextResponse.json({ pins: user?.pins ?? [] })
}

export async function POST(req: NextRequest) {
  const id = getUserId(req)
  if (!id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const pin = await req.json()

  await connectDB()
  const user = await User.findByIdAndUpdate(
    id,
    { $push: { pins: pin } },
    { new: true, select: 'pins' }
  )

  return NextResponse.json({ message: 'Pin added', pins: user?.pins ?? [] }, { status: 201 })
}
