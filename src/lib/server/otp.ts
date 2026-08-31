import bcrypt from 'bcryptjs'
import { sendMail, generateCinematicOtpEmail } from '@/lib/server/mailer'

interface OtpRecord {
  email: string
  otpHash: string
  purpose: 'signup' | 'forgot_password'
  expiresAt: number
}

// In-memory store with global fallback to persist across dev reloads
const globalForOtp = globalThis as unknown as {
  otpCache: Map<string, OtpRecord>
}

const otpCache = globalForOtp.otpCache ?? new Map<string, OtpRecord>()
if (process.env.NODE_ENV !== 'production') globalForOtp.otpCache = otpCache

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of otpCache.entries()) {
    if (record.expiresAt < now) {
      otpCache.delete(key)
    }
  }
}, 5 * 60 * 1000)

function getCacheKey(email: string, purpose: 'signup' | 'forgot_password'): string {
  return `${email.toLowerCase().trim()}:${purpose}`
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP.
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Creates, caches, and sends a cinematic OTP verification email.
 */
export async function createAndSendOtp({
  email,
  name,
  purpose,
}: {
  email: string
  name?: string
  purpose: 'signup' | 'forgot_password'
}): Promise<{ success: boolean; message?: string }> {
  try {
    const cleanEmail = email.toLowerCase().trim()
    const otp = generateOtpCode()
    const otpHash = await bcrypt.hash(otp, 8)
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store in cache
    const key = getCacheKey(cleanEmail, purpose)
    otpCache.set(key, {
      email: cleanEmail,
      otpHash,
      purpose,
      expiresAt,
    })

    const subject = purpose === 'signup' 
      ? `${otp} is your AtlasAura Passport verification code`
      : `${otp} is your AtlasAura password reset code`

    const html = generateCinematicOtpEmail({
      name,
      otp,
      purpose,
    })

    await sendMail(cleanEmail, subject, html)
    return { success: true }
  } catch (err: any) {
    console.error('Error sending OTP:', err)
    return {
      success: false,
      message: err.message || 'Failed to dispatch verification email.',
    }
  }
}

/**
 * Verifies if the provided OTP is valid and unexpired for the given email and purpose.
 * If valid, automatically deletes the OTP to prevent replay attacks.
 */
export async function verifyOtp({
  email,
  otp,
  purpose,
}: {
  email: string
  otp: string
  purpose: 'signup' | 'forgot_password'
}): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim()
  const cleanOtp = otp.trim()
  const key = getCacheKey(cleanEmail, purpose)

  const record = otpCache.get(key)
  if (!record) {
    return false
  }

  if (record.expiresAt < Date.now()) {
    otpCache.delete(key)
    return false
  }

  const isMatch = await bcrypt.compare(cleanOtp, record.otpHash)
  if (!isMatch) {
    return false
  }

  // Consume OTP
  otpCache.delete(key)
  return true
}
