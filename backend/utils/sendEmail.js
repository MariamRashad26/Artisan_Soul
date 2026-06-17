import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[sendEmail] ⚠️  EMAIL_USER or EMAIL_PASS not set in .env — email skipped');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Artisan Soul" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[sendEmail] ✅ Sent to ${to} — MessageId: ${info.messageId}`);
  } catch (err) {
    // Log clearly but do NOT throw — let callers handle gracefully
    console.error(`[sendEmail] ❌ Failed to send to ${to}: ${err.message}`);
    console.error('[sendEmail] Tip: Make sure EMAIL_USER and EMAIL_PASS (App Password) are correct in .env');
    throw err; // Re-throw so caller can catch and log separately
  }
};

export default sendEmail;

