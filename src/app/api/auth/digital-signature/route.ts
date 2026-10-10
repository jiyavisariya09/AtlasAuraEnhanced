import { NextRequest, NextResponse } from 'next/server'
import { randomUUID, createHash } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/server/jwt'
import { parseBody, digitalSignatureSchema } from '@/lib/server/validation'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ message: 'Signature verification token is required.' }, { status: 400 })
    }

    let payload
    try {
      payload = verifyToken(token, 'digital_signature')
    } catch {
      return NextResponse.json({ message: 'Invalid or expired signature registration token.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        digitalSignature: true,
        signatureRegisteredAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'No registered explorer found for this token.' }, { status: 404 })
    }

    return NextResponse.json({
      valid: true,
      user,
      isAlreadySigned: !!user.digitalSignature,
    })
  } catch (err) {
    console.error('Digital signature GET error:', err)
    return NextResponse.json({ message: 'Internal server error verifying token.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = await parseBody(req, digitalSignatureSchema)
    if (!parsed.ok) return parsed.response

    const { token, signatureData, signatureType, signerName } = parsed.data

    let payload
    try {
      payload = verifyToken(token, 'digital_signature')
    } catch {
      return NextResponse.json({ message: 'Invalid or expired signature registration token.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, phone: true },
    })

    if (!user) {
      return NextResponse.json({ message: 'Explorer account not found.' }, { status: 404 })
    }

    const now = new Date()
    // Generate digital certificate SHA-256 fingerprint
    const certHash = createHash('sha256')
      .update(`${user.id}:${user.email}:${now.toISOString()}:${signatureData.slice(0, 50)}`)
      .digest('hex')
    const certificateId = `ATLAS-ESIGN-${certHash.slice(0, 10).toUpperCase()}`

    // Update user record with digital signature
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        digitalSignature: signatureData,
        signatureRegisteredAt: now,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        digitalSignature: true,
        signatureRegisteredAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Official digital signature registered successfully.',
      certificateId,
      registeredAt: now.toISOString(),
      user: updatedUser,
      metadata: {
        signerName,
        signatureType,
        fingerprint: certHash,
        complianceStandard: 'IT Act 2000 / ISO 27001 Cryptographic Signature',
      },
    })
  } catch (err) {
    console.error('Digital signature POST error:', err)
    return NextResponse.json({ message: 'Could not record digital signature. Please try again.' }, { status: 500 })
  }
}
