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
  localStorage.setItem(USER_KEY, JSON.stringify(user))
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
  name?: string
  purpose: 'signup' | 'forgot_password'
}): Promise<{ success: boolean; message: string }> {
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
  otp: string
}): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
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
      joinedAt: json.user.createdAt || new Date().toISOString(),
    }
    setCurrentUser(user)
    return { success: true, user }
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
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
