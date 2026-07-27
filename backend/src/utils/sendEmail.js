const { Resend } = require('resend');

let client = null;
function getClient() {
  if (!client && process.env.RESEND_API_KEY) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

async function sendEmail({ to, subject, html }) {
  const resend = getClient();
  if (!resend) {
    throw new Error('Email service is not configured (missing RESEND_API_KEY)');
  }

  const from = process.env.EMAIL_FROM || 'KAIOR <onboarding@resend.dev>';
  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    throw new Error(error.message || 'Failed to send email');
  }
}

module.exports = { sendEmail };
