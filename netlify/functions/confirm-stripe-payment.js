require("dotenv").config();
const stripe = require("stripe")(import.meta.env.STRIPE_SK);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  const endpointSecret = import.meta.env.STRIPE_ES;
  const sig = event.headers["stripe-signature"];

  let stripeEvent = await stripe.webhooks.constructEvent(
    event.body,
    sig,
    endpointSecret
  );

  const { id, metadata } = await event.body.data.object;

  const msg = {
    to: import.meta.env.SENDGRID_TO,
    cc: import.meta.env.SENDGRID_CC,
    bcc: import.meta.env.SENDGRID_BCC,
    from: import.meta.env.SENDGRID_FROM,
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
