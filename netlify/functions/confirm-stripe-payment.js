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

  if (stripeEvent.type === "payment_intent.succeeded") {
    const blob = stripeEvent.data.object;
    const { id, amount, metadata } = blob;
    let paid = `$${parseInt(amount / 100)}`;

    const msg = {
      to: process.env.SENDGRID_TO,
      from: process.env.SENDGRID_FROM,
      templateId: "d-d7ebf1195f7f4da2a5450a620abd74ff",
      dynamicTemplateData: {
        name: metadata.name,
        pi: id,
        email: metadata.email,
        address: metadata.address,
        city: metadata.city,
        state: metadata.state,
        zip: metadata.zip,
        paid: paid,
        blob: JSON.stringify(blob),
      },
    };
    await sgMail.send(msg);
    return { statusCode: 200 };
  } else {
    return { statusCode: 400 };
  }
};
