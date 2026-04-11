const base = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin:0; padding:0; background:#f0f6ff; font-family:'Segoe UI',Arial,sans-serif; }
    .wrapper { max-width:560px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(14,165,233,0.10); }
    .header { background:linear-gradient(135deg,#38bdf8 0%,#6366f1 100%); padding:36px 40px 28px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:28px; letter-spacing:-0.5px; }
    .header p { margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:14px; }
    .body { padding:36px 40px; color:#1e2d45; }
    .body p { font-size:15px; line-height:1.7; margin:0 0 16px; color:#374151; }
    .btn { display:inline-block; margin:8px 0 24px; padding:14px 32px; background:linear-gradient(135deg,#38bdf8,#6366f1); color:#fff !important; text-decoration:none; border-radius:10px; font-size:15px; font-weight:600; }
    .note { font-size:12px; color:#9ca3af; margin-top:8px; }
    .footer { background:#f8fafc; padding:20px 40px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🌍 AtlasAura</h1>
      <p>Your world, your story</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">© ${new Date().getFullYear()} AtlasAura · All rights reserved</div>
  </div>
</body>
</html>`;

const welcomeTemplate = (name) => base(`
  <p>Hi <strong>${name}</strong> 👋</p>
  <p>Welcome to <strong>AtlasAura</strong> — the place where every journey becomes a story worth telling.</p>
  <p>Your account is ready. Start exploring destinations, pinning memories, and discovering hidden gems around the world.</p>
  <p>Happy travels,<br/><strong>The AtlasAura Team</strong></p>
`);

const resetPasswordTemplate = (name, resetUrl) => base(`
  <p>Hi <strong>${name}</strong>,</p>
  <p>We received a request to reset your AtlasAura password. Click the button below — this link expires in <strong>15 minutes</strong>.</p>
  <a href="${resetUrl}" class="btn">Reset My Password</a>
  <p class="note">If the button doesn't work, copy this link into your browser:<br/>${resetUrl}</p>
  <p>If you didn't request this, you can safely ignore this email. Your password won't change.</p>
  <p>— The AtlasAura Team</p>
`);

module.exports = { welcomeTemplate, resetPasswordTemplate };
