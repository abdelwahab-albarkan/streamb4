import nodemailer from 'nodemailer'

// Escape HTML to prevent XSS when injecting user content into email bodies
function escapeHtml(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = process.env.EMAIL_FROM || 'STREAMB4 <noreply@streamb4.com>'

// Welcome email for new subscriber
export async function sendWelcomeEmail(email: string) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Welcome to STREAMB4 Newsletter! 🎬',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="background:#050505;color:#fff;
        font-family:system-ui;padding:40px;max-width:600px;margin:0 auto">
        
        <div style="text-align:center;margin-bottom:32px">
          <span style="font-size:28px;font-weight:900">
            STREAM<span style="color:#ff7a00">B4</span>
          </span>
        </div>

        <div style="background:#111;border-radius:24px;
          padding:40px;border:1px solid rgba(255,122,0,0.15)">
          
          <h1 style="font-size:28px;margin:0 0 16px;
            color:#fff;font-weight:900">
            Welcome aboard! 🎉
          </h1>
          
          <p style="color:#888;line-height:1.7;margin:0 0 24px">
            You're now subscribed to the STREAMB4 newsletter. 
            You'll receive the latest streaming guides, tips 
            and news directly to your inbox.
          </p>

          <a href="https://streamb4.com/blog"
            style="display:inline-block;
              background:linear-gradient(135deg,#ff7a00,#ffb300);
              color:#000;font-weight:900;padding:14px 32px;
              border-radius:100px;text-decoration:none;
              font-size:14px;text-transform:uppercase">
            Read Latest Articles →
          </a>
        </div>

        <p style="color:#444;font-size:12px;
          text-align:center;margin-top:24px">
          You received this because you subscribed at streamb4.com
          <br/>
          <a href="https://streamb4.com/unsubscribe?email=${email}"
            style="color:#666">Unsubscribe</a>
        </p>
      </body>
      </html>
    `
  })
}

// New comment notification to admin
export async function sendCommentNotification(comment: any, postTitle: string) {
  await transporter.sendMail({
    from: FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New comment on "${postTitle}"`,
    html: `
      <div style="font-family:system-ui;padding:20px">
        <h2>New comment pending approval</h2>
        <p><strong>Post:</strong> ${escapeHtml(postTitle)}</p>
        <p><strong>From:</strong> ${escapeHtml(comment.name)} (${escapeHtml(comment.email)})</p>
        <p><strong>Comment:</strong></p>
        <blockquote style="border-left:4px solid #ff7a00;
          padding-left:16px;margin-left:0;color:#666">
          ${escapeHtml(comment.content)}
        </blockquote>
        <a href="https://streamb4.com/admin/comments"
          style="background:#ff7a00;color:#000;
          padding:10px 24px;border-radius:8px;
          text-decoration:none;font-weight:bold">
          Review Comment
        </a>
      </div>
    `
  })
}

// New post notification to subscribers
export async function sendNewPostNotification(
  post: any, 
  subscribers: string[]
) {
  for (const email of subscribers) {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `New Article: ${post.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#050505;color:#fff;
          font-family:system-ui;padding:40px;
          max-width:600px;margin:0 auto">
          
          <div style="text-align:center;margin-bottom:32px">
            <span style="font-size:24px;font-weight:900">
              STREAM<span style="color:#ff7a00">B4</span>
            </span>
          </div>

          <div style="background:#111;border-radius:24px;
            padding:32px;border:1px solid rgba(255,255,255,0.06)">
            
            ${post.featuredImage ? `
            <img src="${post.featuredImage}" 
              style="width:100%;border-radius:16px;
              margin-bottom:24px;object-fit:cover;height:200px"/>
            ` : ''}

            <span style="background:rgba(255,122,0,0.15);
              color:#ff7a00;padding:4px 12px;border-radius:100px;
              font-size:11px;font-weight:700;text-transform:uppercase">
              ${escapeHtml(post.category)}
            </span>

            <h2 style="font-size:22px;margin:12px 0;color:#fff;
              font-weight:900;line-height:1.3">
              ${escapeHtml(post.title)}
            </h2>

            <p style="color:#888;line-height:1.7;
              margin:0 0 24px;font-size:14px">
              ${escapeHtml(post.excerpt)}
            </p>

            <div style="display:flex;gap:16px;margin-bottom:24px;
              color:#555;font-size:12px">
              <span>📖 ${post.readingTime} min read</span>
              <span>📁 ${post.category}</span>
            </div>

            <a href="https://streamb4.com/blog/${post.slug}"
              style="display:inline-block;
                background:linear-gradient(135deg,#ff7a00,#ffb300);
                color:#000;font-weight:900;padding:14px 32px;
                border-radius:100px;text-decoration:none;
                font-size:14px;text-transform:uppercase">
              Read Article →
            </a>
          </div>

          <p style="color:#333;font-size:12px;
            text-align:center;margin-top:24px">
            <a href="https://streamb4.com/unsubscribe?email=${email}"
              style="color:#555">Unsubscribe</a>
          </p>
        </body>
        </html>
      `
    })
  }
}
