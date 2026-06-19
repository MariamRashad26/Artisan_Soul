import nodemailer from 'nodemailer';

/**
 * sendEmail — production-ready email utility.
 *
 * Supports any SMTP provider via environment variables:
 *   EMAIL_HOST   — SMTP hostname  (e.g. smtp.sendgrid.net)
 *   EMAIL_PORT   — SMTP port      (e.g. 587 for TLS, 465 for SSL)
 *   EMAIL_USER   — SMTP username  (SendGrid: "apikey", Gmail: your address)
 *   EMAIL_PASS   — SMTP password  (SendGrid: API key, Gmail: App Password)
 *   EMAIL_FROM   — Optional sender name/address override
 *
 * If EMAIL_HOST is set, a generic SMTP transporter is used (works with
 * SendGrid, Mailgun, Brevo, etc.). Otherwise, falls back to Gmail service.
 */
const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[sendEmail] ⚠️  EMAIL_USER or EMAIL_PASS not set — email skipped');
    return;
  }

  let transportConfig;

  if (process.env.EMAIL_HOST) {
    // Generic SMTP — works with SendGrid, Mailgun, Brevo, etc.
    transportConfig = {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  } else {
    // Fallback: Gmail with App Password
    transportConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);

  const fromAddress = process.env.EMAIL_FROM || `"Artisan Soul" <${process.env.EMAIL_USER}>`;

  const mailOptions = { from: fromAddress, to, subject, html };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[sendEmail] ✅ Sent to ${to} — MessageId: ${info.messageId}`);
  } catch (err) {
    console.error(`[sendEmail] ❌ Failed to send to ${to}: ${err.message}`);
    throw err; // Re-throw so fire-and-forget callers can log it
  }
};

export default sendEmail;
