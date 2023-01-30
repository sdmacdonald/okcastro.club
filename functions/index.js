const sgMail = require("@sendgrid/mail");
const stripe = require("stripe")(`${process.env.STRIPE_SK}`);
const express = require("express");
const bodyParser = require("body-parser");
const { onRequest } = require("firebase-functions/v1/https");

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: ["https://okcastro.club", "okcac.web.app"],
  })
);

app.post("/create-payment-intent", async (req, res) => {
  const { item } = req.body;

  switch (item) {
    case "membership":
      const items = [9, 6, 3, 36, 33, 30, 27, 24, 21, 18, 15, 12];
      let i = items[new Date().getMonth()] * 100;
      price = Math.round((i + 30) / (1 - 0.029));
      break;
    default:
      price = 3600;
      break;
  }

  const pi = await stripe.paymentIntents.create({
    amount: price,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: req.body,
  });
  res.json({ client_secret: pi.client_secret, amount: pi.amount });
});

app.post(
  "/confirm-payment",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_ES
      );
      res.send(200, "success");
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}: ${event}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const { id, metadata } = event.data.object;
        let data = JSON.stringify(metadata);
        sgMail.setApiKey(process.env.SENDGRID);
        let welcome = "We have a new club member";
        // hey if you come back to this because it doesn't work, check the .env keys and recommit even if they look right.
        const msg = {
          to: process.env.SENDGRID_TO,
          cc: process.env.SENDGRID_CC,
          from: process.env.SENDGRID_FROM,
          subject: `${welcome}`,
          //   text: `${id}: We have a new club member. Data captured: ${metadata}.`,
          html: `<html><body><p><strong>${id}</strong></p>${data}</p></body></html>`,
        };

        sgMail.send(msg);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    response.json({ received: true });
  }
);

exports.stripe = onRequest(app);
