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

  const paymentIntent = await stripeEvent.data.object;
  const { id, metadata } = paymentIntent;

  const msg = {
    to: "editor@okcastroclub.com",
    // cc: process.env.SENDGRID_CC,
    from: "danny@dannymacdonald.me",
    subject: `Sent on ${new Date().getDate()}`,
    //   text: `${id}: We have a new club member. Data captured: ${metadata}.`,
    // text: id,
    html: `<html><body><p><strong>id</strong></p>hi mom</p></body></html>`,
  };
  console.log(stripeEvent);
  sgMail.send(msg);
  // Return a 200 response to acknowledge receipt of the event
  return {
    statusCode: 200,
  };
};
