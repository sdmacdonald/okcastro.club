require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SK);
headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }

  const data = JSON.parse(event.body);

  if (!data.item) {
    console.error("List of items to purchase is missing.");

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: "missing information",
      }),
    };
  }

  try {
    const { item } = data;
    // Add additional product calculations here.
    switch (item) {
      case "membership":
        const items = [9, 6, 3, 36, 33, 30, 27, 24, 21, 18, 15, 12];
        price = items[new Date().getMonth()] * 100;
        // price = Math.round((i + 30) / (1 - 0.029));
        break;
      case "imaging-session":
        price = 100;
        break;
      default:
        price = 3600;
        break;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      description: "",
      metadata: data,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        metadata: { ...paymentIntent.metadata, amount: paymentIntent.amount },
      }),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: err,
      }),
    };
  }
};
