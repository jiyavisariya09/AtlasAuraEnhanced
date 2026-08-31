import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || 'AtlasAura <jiyavisariya@gmail.com>',
    to,
    subject,
    html,
  })
}

/**
 * Generates an ultra-luxurious, cinematic email template matching AtlasAura's design system.
 */
export function generateCinematicOtpEmail({
  name,
  otp,
  purpose,
}: {
  name?: string
  otp: string
  purpose: 'signup' | 'forgot_password'
}) {
  const isSignup = purpose === 'signup'
  const title = isSignup ? 'Verify Your Explorer Passport' : 'Reset Your Journal Passcode'
  const badgeLabel = isSignup ? 'PASSPORT VERIFICATION' : 'SECURITY PASSCODE'
  const greeting = name ? `Greetings Traveler, ${name}` : 'Greetings Traveler'
  const introText = isSignup
    ? 'Welcome to AtlasAura. To complete your passport registration and unlock hidden gems, custom itineraries, and community journals, authorize your email with the one-time passcode below.'
    : 'We received a request to reset your AtlasAura journal credentials. Use the security passcode below to set a new master password.'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 16px;
    }
    .container {
      max-width: 540px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    }
    .hero-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
    }
    .header {
      padding: 28px 32px 16px;
      text-align: center;
      background: #ffffff;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #0f766e;
      background: #ccfbf1;
      border: 1px solid #99f6e4;
      padding: 5px 14px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .logo-badge {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }
    .logo-aurora {
      color: #0d9488;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 8px 0 0 0;
      letter-spacing: -0.3px;
    }
    .content {
      padding: 12px 32px 32px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 10px;
    }
    .description {
      font-size: 14px;
      line-height: 1.65;
      color: #475569;
      margin-bottom: 24px;
    }
    .otp-box {
      background: #f0fdfa;
      border: 2px dashed #14b8a6;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin: 20px 0;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #0f766e;
      margin-bottom: 8px;
    }
    .otp-digits {
      font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #0f766e;
      margin: 0;
      padding-left: 10px;
    }
    .otp-expiry {
      display: inline-block;
      font-size: 12px;
      color: #475569;
      margin-top: 10px;
      background: #e6fffa;
      border: 1px solid #b2f5ea;
      padding: 4px 12px;
      border-radius: 999px;
      font-weight: 500;
    }
    .quote-box {
      margin-top: 20px;
      padding: 14px 18px;
      background: #f8fafc;
      border-left: 3px solid #0d9488;
      border-radius: 0 10px 10px 0;
      font-size: 13px;
      font-style: italic;
      color: #334155;
    }
    .security-note {
      font-size: 12px;
      line-height: 1.55;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      margin-top: 24px;
    }
    .footer {
      background: #f8fafc;
      padding: 20px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
    }
    .footer-coords {
      font-family: monospace;
      color: #0f766e;
      margin-bottom: 4px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- Real Cinematic Travel Banner Image -->
      <img 
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1080&q=80" 
        alt="AtlasAura World Expedition" 
        class="hero-image"
      />

      <!-- Brand Header -->
      <div class="header">
        <div class="badge">${badgeLabel}</div>
        <div class="logo-badge">
          Atlas<span class="logo-aurora">Aura</span>
        </div>
        <h1 class="title">${title}</h1>
      </div>

      <!-- Main Body -->
      <div class="content">
        <div class="greeting">${greeting},</div>
        <p class="description">${introText}</p>

        <!-- High-Contrast 6-Digit OTP Box (Clean Teal & White) -->
        <div class="otp-box">
          <div class="otp-label">Single-Use Security Passcode</div>
          <div class="otp-digits">${otp}</div>
          <div class="otp-expiry">⏳ Expires in 10 minutes</div>
        </div>

        <div class="quote-box">
          &ldquo;Travel is the only thing you buy that makes you richer.&rdquo; — AtlasAura Field Journal
        </div>

        <div class="security-note">
          <strong>Security Notice:</strong> Never share this verification passcode with anyone. AtlasAura guides and curators will never ask for your code. If you did not initiate this request, you can safely disregard this email.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-coords">35.3606° N, 138.7274° E · Global Cartography Node</div>
        <div>&copy; ${new Date().getFullYear()} AtlasAura. Crafted for global explorers.</div>
      </div>

    </div>
  </div>
</body>
</html>
`
}

export function welcomeHtml(name: string) {
  return generateCinematicOtpEmail({
    name,
    otp: 'WELCOME',
    purpose: 'signup',
  })
}

export function resetHtml(name: string, url: string) {
  return `<h2>Hi ${name},</h2><p>Click below to reset your password. This link expires in 1 hour.</p><a href="${url}" style="background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px">Reset Password</a>`
}
