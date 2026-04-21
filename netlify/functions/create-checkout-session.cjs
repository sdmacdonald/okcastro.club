// netlify/functions/create-checkout-session.cjs
// Creates a Stripe PaymentIntent and returns clientSecret to the client.
// Handles membership and imaging-session items.
//
// ENV VARS (set in Netlify dashboard + local .env):
//   STRIPE_SK        — Stripe secret key (server-side only)
//
// NOTE: Astro client env vars use PUBLIC_ prefix.
//   Update your .env and Netlify env:
//     OLD: VITE_STRIPE_PK  →  NEW: PUBLIC_STRIPE_PK
//     OLD: VITE_BASE_URL   →  no longer needed (relative fetch paths work in Astro)

'use strict';

// ── Price table (must match src/assets/data/getPrice.js exactly) ──
const MEMBERSHIP_PRICES = [45, 42, 39, 36, 33, 30, 27, 24, 21, 18, 15, 12]; // index 0=Jan

function getMembershipPrice() {
  return MEMBERSHIP_PRICES[new Date().getMonth()];
}

const ITEMS = {
  'membership': {
    name: 'OKCAC Annual Membership',
    getAmount: () => getMembershipPrice() * 100, // cents
  },
  'imaging-session': {
    name: 'Okie-Tex PixInsight Imaging Workshop',
    getAmount: () => 10000, // $100.00
  },
};

const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return respond(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return respond(400, { error: 'Invalid JSON body' });
  }

  const { name, email, address, city, state, zip, item } = body;

  // item is required — no default
  if (!item) {
    return respond(400, { error: 'item is required (membership or imaging-session)' });
  }

  const itemConfig = ITEMS[item];
  if (!itemConfig) {
    return respond(400, { error: `Unknown item: ${item}` });
  }

  if (!name || !email) {
    return respond(400, { error: 'Name and email are required.' });
  }

  const amount = itemConfig.getAmount();

  try {
    const stripe = require('stripe')(process.env.STRIPE_SK);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: email,
      description: itemConfig.name,
      metadata: {
        item,
        amount: String(amount),
        name,
        email,
        address: address || '',
        city: city || '',
        state: state || '',
        zip: zip || '',
      },
    });

    return respond(200, {
      clientSecret: paymentIntent.client_secret,
      metadata: { amount, item },
    });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return respond(500, { error: err.message });
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

module.exports = { handler, getMembershipPrice, MEMBERSHIP_PRICES };
