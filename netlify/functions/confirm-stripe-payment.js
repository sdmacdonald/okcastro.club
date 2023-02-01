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

  const { metadata } = await event.body.data;

  const msg = {
    to: "s.danny.macdonald@gmail.com",
    // cc: process.env.SENDGRID_CC,
    from: "danny@dannymacdonald.me",
    subject: `New Club Member: ${metadata}`,
    text: `We have a new club member. Data captured: ${metadata}.`,
    html: `<html><body>${metadata}</body></html>`,
  };

  if (stripeEvent.type === "payment_intent.succeeded") {
    await sgMail.send(msg);
    console.log(event.body, msg);
    return { statusCode: 200 };
  } else {
    return { statusCode: 400, err: "unexpected event type" };
  }
};
