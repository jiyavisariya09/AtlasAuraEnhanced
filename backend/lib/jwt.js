const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

const verifyToken = (token) => jwt.verify(token, SECRET);

// Short-lived token for password reset (15 min)
const signResetToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '15m' });

module.exports = { signToken, verifyToken, signResetToken };
