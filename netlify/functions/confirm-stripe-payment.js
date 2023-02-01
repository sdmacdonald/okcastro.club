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

  switch (stripeEvent.type) {
    case "payment_intent.succeeded":
      const paymentIntent = stripeEvent.data.object;
      const { id, metadata } = paymentIntent;

      const msg = {
        to: process.env.SENDGRIP_TO,
        // cc: process.env.SENDGRID_CC,
        from: process.env.SENDGRID_FROM,
        subject: `New Club Member: ${metadata.name}`,
        text: `${id}: We have a new club member. Data captured: ${metadata}.`,
        html: `<html><body><ul></ul><sub>${metadata}</sub></body></html>`,
      };
      await sgMail.send(msg);
      break;
    default:
      // Unexpected event type
      return { statusCode: 400, err: "unexpected event type" };
  }

  // Return a 200 response to acknowledge receipt of the event
  return {
    statusCode: 200,
  };
};
