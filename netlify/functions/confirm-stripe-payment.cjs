'use strict';

let _stripe;
let _sgMail;

function getStripe() {
  if (!_stripe) _stripe = require('stripe')(process.env.STRIPE_SK);
  return _stripe;
}

function getSendGrid() {
  if (!_sgMail) {
    _sgMail = require('@sendgrid/mail');
    _sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
  return _sgMail;
}

function getRawBody(event) {
  if (event.isBase64Encoded && typeof event.body === 'string') {
    return Buffer.from(event.body, 'base64').toString('utf8');
  }
  return event.body;
}

function formatDollars(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return null;
  return (n / 100).toFixed(2);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers && (event.headers['stripe-signature'] || event.headers['Stripe-Signature']);
  const rawBody = getRawBody(event);
  let stripeEvent;

  try {
    stripeEvent = getStripe().webhooks.constructEvent(rawBody, sig, process.env.STRIPE_ES);
  } catch (err) {
    console.error('Webhook signature verification failed:', err && err.message);
    await notifyError(`Webhook signature failed: ${err && err.message}`).catch(() => {});
    return { statusCode: 400, body: `Webhook Error: ${err && err.message}` };
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const pi = stripeEvent.data.object;
    const { item, name, email, amount } = pi.metadata || {};

    if (!email) {
      console.warn('No email in PaymentIntent metadata — skipping confirmation send.');
      return { statusCode: 200, body: 'OK (no email)' };
    }

    const dollars = formatDollars(amount);
    if (!dollars) {
      console.warn('Missing or invalid amount in PaymentIntent metadata — skipping send.');
      return { statusCode: 200, body: 'OK (no amount)' };
    }

    try {
      if (item === 'imaging-session') {
        await sendImagingConfirmation({ name, email, amount, item, dollars });
      } else {
        await sendMembershipConfirmation({ name, email, amount, item, dollars });
      }
    } catch (err) {
      const body = err && err.response && err.response.body;
      const detail = body ? JSON.stringify(body) : (err && err.message);
      console.error('SendGrid error:', detail);
      await notifyError(`SendGrid failed for ${email}: ${detail}`).catch(() => {});
    }
  } else {
    console.log(`Ignoring event type: ${stripeEvent.type}`);
  }

  return { statusCode: 200, body: 'OK' };
};

async function sendMembershipConfirmation({ name, email, amount, item, dollars }) {
  await getSendGrid().send({
    to: email,
    from: process.env.SENDGRID_FROM,
    bcc: process.env.SENDGRID_BCC,
    templateId: process.env.SENDGRID_MEMBERSHIP_TEMPLATE_ID,
    dynamicTemplateData: { name, email, item, amount, dollars },
  });
}

async function sendImagingConfirmation({ name, email, amount, item, dollars }) {
  await getSendGrid().send({
    to: email,
    from: process.env.SENDGRID_FROM_OTSP || process.env.SENDGRID_FROM,
    bcc: process.env.SENDGRID_BCC,
    templateId: process.env.SENDGRID_IMAGING_TEMPLATE_ID,
    dynamicTemplateData: { name, email, item, amount, dollars },
  });
}

async function notifyError(message) {
  const recipient = process.env.SENDGRID_ERROR_RECIPIENT;
  if (!recipient) return;
  await getSendGrid().send({
    to: recipient,
    from: process.env.SENDGRID_FROM,
    subject: '[OTSP] Webhook error',
    text: message,
  });
}

module.exports.getRawBody = getRawBody;
module.exports.formatDollars = formatDollars;
