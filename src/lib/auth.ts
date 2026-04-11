export interface AuthUser {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  joinedAt: string
  travelStyle?: string[]
  dreamDestinations?: string
}

const USER_KEY = 'atlasaura-user'
const USERS_DB_KEY = 'atlasaura-users-db'

// ── Helpers ──────────────────────────────────────────────
function getUsersDB(): Record<string, AuthUser & { passwordHash: string }> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveUsersDB(db: Record<string, AuthUser & { passwordHash: string }>) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db))
}

// Simple hash — good enough for a frontend demo
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash.toString(36)
}

// ── Public API ────────────────────────────────────────────
export function signUp(data: {
  name: string
  email: string
  phone: string
  password: string
}): { success: boolean; error?: string; user?: AuthUser } {
  const db = getUsersDB()
  const emailKey = data.email.toLowerCase()

  if (db[emailKey]) {
    return { success: false, error: 'An account with this email already exists.' }
  }

  const user: AuthUser = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    email: emailKey,
    phone: data.phone,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
    joinedAt: new Date().toISOString(),
  }

  db[emailKey] = { ...user, passwordHash: simpleHash(data.password) }
  saveUsersDB(db)
  setCurrentUser(user)
  return { success: true, user }
}

export function signIn(data: {
  email: string
  password: string
}): { success: boolean; error?: string; user?: AuthUser } {
  const db = getUsersDB()
  const emailKey = data.email.toLowerCase()
  const record = db[emailKey]

  if (!record) {
    return { success: false, error: 'No account found with this email.' }
  }

  if (record.passwordHash !== simpleHash(data.password)) {
    return { success: false, error: 'Incorrect password.' }
  }

  const { passwordHash: _, ...user } = record
  setCurrentUser(user)
  return { success: true, user }
}

export function setCurrentUser(user: AuthUser) {
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

export function signOut() {
  localStorage.removeItem(USER_KEY)
}

export function updateUserPreferences(prefs: Partial<AuthUser>) {
  const user = getCurrentUser()
  if (!user) return
  const updated = { ...user, ...prefs }
  setCurrentUser(updated)

  // Also update in DB
  const db = getUsersDB()
  if (db[user.email]) {
    db[user.email] = { ...db[user.email], ...prefs }
    saveUsersDB(db)
  }
}
