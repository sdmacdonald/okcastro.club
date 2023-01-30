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
  let stripeEvent;

  try {
    // Verifies that the event was sent by Stripe and deserializes the event
    stripeEvent = await stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    return { statusCode: 400, stripeEvent: stripeEvent };
  }

  switch (stripeEvent.type) {
    case "payment_intent.succeeded":
      // hey if you come back to this because it doesn't work, check the .env keys and recommit even if they look right.
      const msg = {
        to: "s.danny.macdonald@gmail.com",
        // cc: process.env.SENDGRID_CC,
        from: "danny@dannymacdonald.me",
        subject: "Hi mom",
        //   text: `${id}: We have a new club member. Data captured: ${metadata}.`,
        // text: id,
        html: `<html><body><p><strong>id</strong></p>hi mom</p></body></html>`,
      };
      sgMail.send(msg);

      break;
    case "charge.dispute.created":
      const charge = stripeEvent.data.object;
      console.log("Someone disputed a payment!");
      break;
    // ... handle other event types
    default:
      // Unexpected event type
      return { statusCode: 400 };
  }

  // Return a 200 response to acknowledge receipt of the event
  return {
    statusCode: 200,
  };
};
