import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn']

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN })
}

export function signResetToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as jwt.JwtPayload
}
