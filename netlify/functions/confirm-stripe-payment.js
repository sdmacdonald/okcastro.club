// Webhook that listens for events sent from Stripe
// Requires configuration in the Stripe Dashboard
// For more information read https://stripe.com/docs/webhooks
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SK);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  const endpointSecret = process.env.STRIPE_ES;
  const sig = event.headers["stripe-signature"];

  let stripeEvent = await stripe.webhooks.constructEvent(
    event.body,
    sig,
    endpointSecret
  );

  const { id, metadata } = await event.body.data.object;

  const msg = {
    to: process.env.SENDGRID_TO,
    cc: process.env.SENDGRID_CC,
    bcc: process.env.SENDGRID_BCC,
    from: process.env.SENDGRID_FROM,
    subject: `New Club Member: ${metadata.name}`,
    text: `${id}: We have a new club member. Data captured: ${metadata}.`,
    html: `<html><body><p>${metadata}</p></body></html>`,
  };

  if (stripeEvent.type === "payment_intent.succeeded") {
    await sgMail.send(msg);
    return { statusCode: 200 };
  } else {
    return { statusCode: 400, err: "unexpected event type" };
  }
};
