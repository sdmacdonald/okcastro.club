const {
  SENDGRID_TO,
  SENDGRID_FROM,
  SENDGRID_CC,
  SENDGRID_BCC,
  SENDGRID_API_KEY,
  STRIPE_ES,
  STRIPE_SK,
} = import.meta.env;

require("dotenv").config();
const stripe = require("stripe")(STRIPE_SK);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  const endpointSecret = STRIPE_ES;
  const sig = event.headers["stripe-signature"];

  let stripeEvent = await stripe.webhooks.constructEvent(
    event.body,
    sig,
    endpointSecret
  );

  const { id, metadata } = await event.body.data.object;

  const msg = {
    to: SENDGRID_TO,
    cc: SENDGRID_CC,
    bcc: SENDGRID_BCC,
    from: SENDGRID_FROM,
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
