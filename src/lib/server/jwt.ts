import jwt from 'jsonwebtoken'

/* One algorithm, named on both ends. Left unpinned, `jwt.verify` honours the
   algorithm the *token's own header* asks for — which is how an HMAC verifier
   gets talked into accepting `alg: none`. Naming it here means the header is
   checked against this list rather than trusted. */
const ALGORITHM: jwt.Algorithm = 'HS256'

const SESSION_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn']
const RESET_EXPIRES_IN = '1h'

/* Every token says what it is for. Without this, a password-reset link — which
   is emailed, lives in a URL, and ends up in browser history and server logs —
   was a valid session cookie: both were signed with the same secret and
   `verifyToken` never looked at the claim, so pasting a reset token into the
   `token` cookie logged you in as that user for an hour. */
export type TokenPurpose = 'session' | 'reset'

interface AtlasTokenPayload extends jwt.JwtPayload {
  id: string
  purpose: TokenPurpose
}

/* Checked on first use rather than at import time. Both are real failures, but
   throwing at module load would break `next build` in any environment that
   builds without secrets present, while this fails the request — loudly, and
   only where a token is actually needed.

   The old code read `process.env.JWT_SECRET!`. The `!` silences TypeScript
   without doing anything at runtime, so a missing variable meant tokens were
   signed with the literal string "undefined" — a secret an attacker can guess
   on the first try. */
let cachedSecret: string | null = null

function secret(): string {
  if (cachedSecret) return cachedSecret
  const value = process.env.JWT_SECRET
  if (!value || value.length < 32) {
    throw new Error(
      'JWT_SECRET is missing or shorter than 32 characters. Generate one with `openssl rand -base64 48` and set it in .env before starting the server.',
    )
  }
  cachedSecret = value
  return value
}

export function signToken(payload: { id: string; name?: string; email?: string }) {
  return jwt.sign({ ...payload, purpose: 'session' satisfies TokenPurpose }, secret(), {
    expiresIn: SESSION_EXPIRES_IN,
    algorithm: ALGORITHM,
  })
}

export function signResetToken(payload: { id: string }) {
  return jwt.sign({ ...payload, purpose: 'reset' satisfies TokenPurpose }, secret(), {
    expiresIn: RESET_EXPIRES_IN,
    algorithm: ALGORITHM,
  })
}

/**
 * Verifies a token and confirms it was issued for the purpose being asked of it.
 * Throws on a bad signature, an expired token, a wrong algorithm, or a purpose
 * mismatch — callers are expected to treat all four the same way.
 *
 * Note for whoever deploys this: sessions issued before the `purpose` claim
 * existed no longer verify, so everyone currently signed in is signed out once.
 * That is the intended cost of closing the reset-token hole.
 */
export function verifyToken(token: string, purpose: TokenPurpose = 'session'): AtlasTokenPayload {
  const payload = jwt.verify(token, secret(), { algorithms: [ALGORITHM] }) as AtlasTokenPayload

  if (payload.purpose !== purpose) {
    throw new jwt.JsonWebTokenError(`Token purpose mismatch: expected ${purpose}`)
  }
  if (typeof payload.id !== 'string' || payload.id.length === 0) {
    throw new jwt.JsonWebTokenError('Token is missing a subject id')
  }

  return payload
}
