// netlify/functions/confirm-stripe-payment.cjs
// Stripe webhook handler — fires on payment_intent.succeeded.
// Validates the webhook signature, then sends a SendGrid confirmation email.
//
// ENV VARS REQUIRED:
//   STRIPE_SK                   — Stripe secret key
//   STRIPE_ES                   — Stripe webhook signing secret (from Stripe dashboard)
//   SENDGRID_API_KEY            — SendGrid API key
//   SENDGRID_FROM               — From address for membership emails (e.g. "OKCAC <noreply@okcastroclub.com>")
//   SENDGRID_FROM_OTSP          — From address for OTSP/imaging emails
//   SENDGRID_BCC                — BCC address (club treasurer/admin)
//   SENDGRID_MEMBERSHIP         — SendGrid template ID for membership confirmation
//   SENDGRID_ERROR_RECIPIENT    — Address to notify on webhook errors

'use strict';

const stripe = require('stripe')(process.env.STRIPE_SK);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  // Only accept POST from Stripe
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // ── Validate Stripe webhook signature ──────────────────────
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_ES
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    // Notify admin of bad signature (possible replay attack or misconfiguration)
    await notifyError(`Webhook signature failed: ${err.message}`).catch(() => {});
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // ── Handle payment_intent.succeeded ───────────────────────
  if (stripeEvent.type === 'payment_intent.succeeded') {
    const pi = stripeEvent.data.object;
    const { item, name, email, amount } = pi.metadata || {};

    if (!email) {
      console.warn('No email in PaymentIntent metadata — skipping confirmation send.');
      return { statusCode: 200, body: 'OK (no email)' };
    }

    try {
      if (item === 'imaging-session') {
        await sendImagingConfirmation({ name, email, amount });
      } else {
        // Default: membership
        await sendMembershipConfirmation({ name, email, amount });
      }
    } catch (err) {
      console.error('SendGrid error:', err.message);
      await notifyError(`SendGrid failed for ${email}: ${err.message}`).catch(() => {});
      // Return 200 so Stripe doesn't retry — email failure is non-fatal for payment record
    }
  }

  return { statusCode: 200, body: 'OK' };
};

// ── Email senders ──────────────────────────────────────────

async function sendMembershipConfirmation({ name, email, amount }) {
  const dollars = (parseInt(amount) / 100).toFixed(2);
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM,
    bcc: process.env.SENDGRID_BCC,
    templateId: process.env.SENDGRID_MEMBERSHIP,
    dynamicTemplateData: {
      name,
      amount: dollars,
      club: 'Oklahoma City Astronomy Club',
    },
    // Plain text fallback if no template configured
    subject: 'Welcome to the Oklahoma City Astronomy Club!',
    text: `Hi ${name},\n\nThank you for joining the Oklahoma City Astronomy Club! Your payment of $${dollars} has been received.\n\nClear skies,\nOKCAC`,
  };

  // Use template if ID configured, otherwise send plain message
  if (!process.env.SENDGRID_MEMBERSHIP) {
    delete msg.templateId;
    delete msg.dynamicTemplateData;
  }

  await sgMail.send(msg);
}

async function sendImagingConfirmation({ name, email, amount }) {
  const dollars = (parseInt(amount) / 100).toFixed(2);
  await sgMail.send({
    to: email,
    from: process.env.SENDGRID_FROM_OTSP || process.env.SENDGRID_FROM,
    bcc: process.env.SENDGRID_BCC,
    subject: 'Your Okie-Tex PixInsight Workshop seat is confirmed!',
    text: [
      `Hi ${name},`,
      ``,
      `Your seat in the Okie-Tex PixInsight Imaging Workshop is confirmed. Payment of $${dollars} received.`,
      ``,
      `Workshop details:`,
      `  Dates:    Sunday–Monday, October 11`,
      `  Location: Kenton Senior Center, Kenton, OK`,
      `  Time:     10am–4:30pm CT (lunch break included)`,
      ``,
      `You must be registered for the Okie-Tex Star Party to attend.`,
      ``,
      `Clear skies,`,
      `Okie-Tex Star Party`,
    ].join('\n'),
  });
}

async function notifyError(message) {
  const recipient = process.env.SENDGRID_ERROR_RECIPIENT;
  if (!recipient) return;
  await sgMail.send({
    to: recipient,
    from: process.env.SENDGRID_FROM,
    subject: '[OTSP] Webhook error',
    text: message,
  });
}
