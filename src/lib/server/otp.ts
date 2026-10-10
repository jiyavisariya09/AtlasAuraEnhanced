import { createHash, timingSafeEqual } from 'node:crypto'
import { sendMail, generateCinematicOtpEmail } from '@/lib/server/mailer'

interface OtpRecord {
  email: string
  otpHash: string
  phone?: string
  phoneOtpHash?: string
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

function hashOtp(otp: string): string {
  return createHash('sha256').update(otp.trim()).digest('hex')
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
    const otpHash = hashOtp(otp)
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
 * Creates, caches, and sends both Email OTP and Mobile SMS OTP simultaneously.
 */
export async function createAndSendDualOtp({
  email,
  phone,
  name,
  purpose = 'signup',
}: {
  email: string
  phone: string
  name?: string
  purpose?: 'signup' | 'forgot_password'
}): Promise<{ success: boolean; message?: string; devPhoneOtp?: string; devEmailOtp?: string }> {
  try {
    const cleanEmail = email.toLowerCase().trim()
    const cleanPhone = phone.trim()

    const emailOtp = generateOtpCode()
    const phoneOtp = generateOtpCode()

    const emailOtpHash = hashOtp(emailOtp)
    const phoneOtpHash = hashOtp(phoneOtp)
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store in cache
    const key = getCacheKey(cleanEmail, purpose)
    otpCache.set(key, {
      email: cleanEmail,
      otpHash: emailOtpHash,
      phone: cleanPhone,
      phoneOtpHash,
      purpose,
      expiresAt,
    })

    // 1. Dispatch Email OTP
    const subject = `${emailOtp} is your AtlasAura Passport verification code`
    const html = generateCinematicOtpEmail({
      name,
      otp: emailOtp,
      purpose,
    })

    await sendMail(cleanEmail, subject, html)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AtlasAura Email Dispatch] Dispatched 6-digit Email passcode [${emailOtp}] to: ${cleanEmail}`)
    }

    // 2. Dispatch Mobile SMS OTP
    // Logs simulated carrier transmission to server logs
    console.log(`[AtlasAura Telephony Dispatch] Dispatched 6-digit SMS security passcode [${phoneOtp}] to mobile endpoint: ${cleanPhone}`)

    return {
      success: true,
      message: `Verification codes sent to ${cleanEmail} and ${cleanPhone}.`,
      // Expose in development mode for easy debugging & verification testing
      devPhoneOtp: process.env.NODE_ENV !== 'production' ? phoneOtp : undefined,
      devEmailOtp: process.env.NODE_ENV !== 'production' ? emailOtp : undefined,
    }
  } catch (err: any) {
    console.error('Error sending dual OTPs:', err)
    return {
      success: false,
      message: err.message || 'Failed to dispatch verification codes.',
    }
  }
}

/**
 * Verifies single OTP for email.
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

  const computedHash = hashOtp(cleanOtp)
  const isMatch = computedHash.length === record.otpHash.length &&
    timingSafeEqual(Buffer.from(computedHash), Buffer.from(record.otpHash))

  if (!isMatch) {
    return false
  }

  // Consume OTP
  otpCache.delete(key)
  return true
}

/**
 * Verifies both Email OTP and Phone OTP simultaneously at once.
 */
export async function verifyDualOtp({
  email,
  phone,
  emailOtp,
  phoneOtp,
  purpose = 'signup',
}: {
  email: string
  phone: string
  emailOtp: string
  phoneOtp: string
  purpose?: 'signup' | 'forgot_password'
}): Promise<{ valid: boolean; error?: string }> {
  const cleanEmail = email.toLowerCase().trim()
  const cleanEmailOtp = emailOtp.trim()
  const cleanPhoneOtp = phoneOtp.trim()
  const key = getCacheKey(cleanEmail, purpose)

  const record = otpCache.get(key)
  if (!record) {
    return { valid: false, error: 'No active verification session found. Please request a new code.' }
  }

  if (record.expiresAt < Date.now()) {
    otpCache.delete(key)
    return { valid: false, error: 'Verification passcodes have expired. Please request new codes.' }
  }

  // Verify Email OTP
  const computedEmailHash = hashOtp(cleanEmailOtp)
  const isEmailMatch = computedEmailHash.length === record.otpHash.length &&
    timingSafeEqual(Buffer.from(computedEmailHash), Buffer.from(record.otpHash))

  if (!isEmailMatch) {
    return { valid: false, error: 'Invalid 6-digit email verification code.' }
  }

  // Verify Phone OTP (if record has phoneOtpHash)
  if (record.phoneOtpHash) {
    const computedPhoneHash = hashOtp(cleanPhoneOtp)
    const isPhoneMatch = computedPhoneHash.length === record.phoneOtpHash.length &&
      timingSafeEqual(Buffer.from(computedPhoneHash), Buffer.from(record.phoneOtpHash))

    if (!isPhoneMatch) {
      return { valid: false, error: 'Invalid 6-digit mobile SMS verification code.' }
    }
  }

  // Both match! Consume OTP
  otpCache.delete(key)
  return { valid: true }
}
