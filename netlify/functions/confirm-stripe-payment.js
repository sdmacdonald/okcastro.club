// Webhook that listens for events sent from Stripe
// Requires configuration in the Stripe Dashboard
// For more information read https://stripe.com/docs/webhooks

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SK); // Stripe Secret Key in .env
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // SendGrid API key in .env

// Async function that generates a SendGrid email.
// Function takes two parameters: templateID and any dynamic data the template uses.
const sendMail = async (template, data, from) => {
  const msg = {
    to: metadata.email,
    from: from || process.env.SENDGRID_FROM,
    bcc: process.env.SENDGRID_BCC,
    templateId: template || "",
    dynamicTemplateData: data || "",
  };
  await sgMail.send(msg);
};

exports.handler = async (event, context) => {
  const endpointSecret = process.env.STRIPE_ES; // Stripe webhook UUID from Stripe Dashboard
  const sig = event.headers["stripe-signature"];

  let stripeEvent = await stripe.webhooks.constructEvent(
    event.body,
    sig,
    endpointSecret
  );

  if (stripeEvent.type === "payment_intent.succeeded") {
    const { metadata } = stripeEvent.data.object;

    switch (metadata.item) {
      // Send this email if someone joins the club online at okcastro.club
      case "membership":
        sendMail("d-953aa278a8f34d2a9f85b9ed0622ca4d", {
          name: metadata.name,
          membership_coordinator: process.env.SENDGRID_MEMBERSHIP,
        });
        return { statusCode: 200 };

      // Send this email if someone buys the PixInsight Imaging Session
      case "imaging-session":
        sendMail(
          "d-391abf270f1742699767e84fbded8084",
          { name: metadata.name },
          process.env.SENDGRID_FROM_OTSP
        );
        return { statusCode: 200 };

      // Notify the okcac if something weird happens
      default:
        msg = {
          to: process.env.SENDGRID_ERROR_RECIPIENT,
          FROM: process.env.SENDGRID_FROM,
          body: "An error occured with this payment",
          html: blob,
        };
        await sgMail.send(msg);
    }
  } else {
    return { statusCode: 400 };
  }
};
