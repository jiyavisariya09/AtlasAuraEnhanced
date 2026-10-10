export interface AuthUser {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  joinedAt?: string
  travelStyle?: string[]
  dreamDestinations?: string
  countriesExplored?: number
  contributionScore?: number
  streakDays?: number
  digitalSignature?: string
  signatureRegisteredAt?: string
  badges?: Array<{
    id?: string
    badgeKey: string
    name: string
    icon: string
    description: string
    earned?: boolean
  }>
  counts?: {
    pins: number
    gems: number
    tripPlans: number
    journals: number
    answers: number
  }
}

const USER_KEY = 'atlasaura-user'

// ── Session helpers (client-side only) ───────────────────
export function setCurrentUser(user: AuthUser) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    try {
      // If large image exceeds quota, store lightweight metadata in client storage while MongoDB holds full avatar
      const lightweight = { ...user, avatar: user.avatar && user.avatar.length < 50000 ? user.avatar : undefined }
      localStorage.setItem(USER_KEY, JSON.stringify(lightweight))
    } catch {
      // Ignore if localStorage completely full
    }
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function fetchSession(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me')
    const json = await res.json()
    if (res.ok && json.user) {
      setCurrentUser(json.user)
      return json.user
    }
    return null
  } catch {
    return getCurrentUser()
  }
}

export function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('atlasaura-favorite-destinations');
    localStorage.removeItem('atlasaura-user-pins');
    localStorage.removeItem('atlasaura-preferences');
    localStorage.removeItem('atlasaura-trip-plans');
    localStorage.removeItem('atlasaura-journal');
  }
  fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
}

export function updateUserPreferences(prefs: Partial<AuthUser>) {
  const user = getCurrentUser()
  if (!user) return
  const updated = { ...user, ...prefs }
  setCurrentUser(updated)
}

// ── API calls ─────────────────────────────────────────────
export async function sendOtp(data: {
  email: string
  phone?: string
  name?: string
  purpose: 'signup' | 'forgot_password'
}): Promise<{ success: boolean; message: string; devPhoneOtp?: string }> {
  try {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    return {
      success: res.ok,
      message: json.message || (res.ok ? 'Code sent.' : 'Failed to send code.'),
      devPhoneOtp: json.devPhoneOtp,
    }
  } catch {
    return { success: false, message: 'Network error. Please try again.' }
  }
}

export async function signUp(data: {
  name: string
  email: string
  phone?: string
  password: string
  emailOtp?: string
  phoneOtp?: string
  otp?: string
}): Promise<{
  success: boolean
  error?: string
  user?: AuthUser
  signatureToken?: string
  signatureLink?: string
}> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) return { success: false, error: json.message }
    const user: AuthUser = {
      ...json.user,
      joinedAt: json.user?.createdAt || new Date().toISOString(),
    }
    setCurrentUser(user)
    return {
      success: true,
      user,
      signatureToken: json.signatureToken,
      signatureLink: json.signatureLink,
    }
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

export async function submitDigitalSignature(data: {
  token: string
  signatureData: string
  signatureType: 'draw' | 'type' | 'upload'
  signerName: string
  agreedToTerms: boolean
}): Promise<{
  success: boolean
  error?: string
  certificateId?: string
  registeredAt?: string
  user?: AuthUser
}> {
  try {
    const res = await fetch('/api/auth/digital-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) return { success: false, error: json.message }
    if (json.user) {
      setCurrentUser(json.user)
    }
    return {
      success: true,
      certificateId: json.certificateId,
      registeredAt: json.registeredAt,
      user: json.user,
    }
  } catch {
    return { success: false, error: 'Network error submitting digital signature.' }
  }
}

export async function getDigitalSignatureStatus(token: string): Promise<{
  valid: boolean
  error?: string
  user?: AuthUser
  isAlreadySigned?: boolean
}> {
  try {
    const res = await fetch(`/api/auth/digital-signature?token=${encodeURIComponent(token)}`)
    const json = await res.json()
    if (!res.ok) return { valid: false, error: json.message }
    return {
      valid: true,
      user: json.user,
      isAlreadySigned: json.isAlreadySigned,
    }
  } catch {
    return { valid: false, error: 'Could not connect to signature registry server.' }
  }
}

export async function signIn(data: {
  email: string
  password: string
}): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) return { success: false, error: json.message }
    const user: AuthUser = {
      ...json.user,
      joinedAt: json.user.createdAt || new Date().toISOString(),
    }
    setCurrentUser(user)
    return { success: true, user }
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  return sendOtp({ email, purpose: 'forgot_password' })
}

export async function resetPasswordWithOtp(data: {
  email: string
  otp: string
  newPassword: string
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    return { success: res.ok, message: json.message }
  } catch {
    return { success: false, message: 'Network error. Please try again.' }
  }
}
