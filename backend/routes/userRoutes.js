const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const { signToken, signResetToken, verifyToken } = require('../lib/jwt');
const { sendMail } = require('../lib/mailer');
const { welcomeTemplate, resetPasswordTemplate } = require('../utils/emailTemplates');
const { protect } = require('../middleware/authMiddleware');

// ─── Helper ────────────────────────────────────────────────────────────────
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── POST /api/users/signup ─────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, phone, password });

    // Send welcome email (non-blocking)
    sendMail({
      to: user.email,
      subject: 'Welcome to AtlasAura 🌍',
      html: welcomeTemplate(user.name),
    }).catch(console.error);

    const token = signToken({ id: user._id, name: user.name, email: user.email });
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/users/login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = signToken({ id: user._id, name: user.name, email: user.email });
    res.cookie('token', token, cookieOptions);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/users/logout ─────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
});

// ─── POST /api/users/forgot-password ───────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    const user = await User.findOne({ email });
    // Always respond the same to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = signResetToken({ id: user._id, purpose: 'reset' });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendMail({
      to: user.email,
      subject: 'Reset your AtlasAura password',
      html: resetPasswordTemplate(user.name, resetUrl),
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reset email. Try again.' });
  }
});

// ─── POST /api/users/reset-password ────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded.purpose !== 'reset') throw new Error('Invalid token purpose.');

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = password; // pre-save hook will hash it
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(400).json({ message: 'Reset link is invalid or has expired.' });
  }
});

// ─── GET /api/users/me (protected) ─────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/users (dev only) ──────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
