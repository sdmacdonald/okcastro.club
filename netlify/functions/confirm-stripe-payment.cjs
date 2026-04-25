'use strict';

const stripe = require('stripe')(process.env.STRIPE_SK);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const MEMBERSHIP_TEMPLATE_ID = '953aa278a8f34d2a9f85b9ed0622ca4d';
const IMAGING_TEMPLATE_ID = '391abf270f1742699767e84fbded8084';

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
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_ES);
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
      console.error('SendGrid error:', err && err.message);
      await notifyError(`SendGrid failed for ${email}: ${err && err.message}`).catch(() => {});
    }
  } else {
    console.log(`Ignoring event type: ${stripeEvent.type}`);
  }

  return { statusCode: 200, body: 'OK' };
};

async function sendMembershipConfirmation({ name, email, amount, item, dollars }) {
  await sgMail.send({
    to: email,
    from: process.env.SENDGRID_FROM,
    bcc: process.env.SENDGRID_BCC,
    templateId: MEMBERSHIP_TEMPLATE_ID,
    dynamicTemplateData: { name, email, item, amount, dollars },
  });
}

async function sendImagingConfirmation({ name, email, amount, item, dollars }) {
  await sgMail.send({
    to: email,
    from: process.env.SENDGRID_FROM_OTSP || process.env.SENDGRID_FROM,
    bcc: process.env.SENDGRID_BCC,
    templateId: IMAGING_TEMPLATE_ID,
    dynamicTemplateData: { name, email, item, amount, dollars },
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

module.exports.getRawBody = getRawBody;
module.exports.formatDollars = formatDollars;
