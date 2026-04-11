import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html })
}

export function welcomeHtml(name: string) {
  return `<h2>Welcome to AtlasAura, ${name}! 🌍</h2><p>Your account is ready. Start exploring the world.</p>`
}

export function resetHtml(name: string, url: string) {
  return `<h2>Hi ${name},</h2><p>Click below to reset your password. This link expires in 1 hour.</p><a href="${url}" style="background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px">Reset Password</a>`
}
