require("dotenv").config();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MEMBERSHIP_PRICES = [45, 42, 39, 36, 33, 30, 27, 24, 21, 18, 15, 12];

function getMembershipPrice() {
  return MEMBERSHIP_PRICES[new Date().getMonth()];
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, address, city, state, zip, item } = data;

  if (!item) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing item" }) };
  }

  let unitAmount, productName;
  switch (item) {
    case "membership":
      unitAmount = getMembershipPrice() * 100;
      productName = "OKC Astronomy Club Membership";
      break;
    case "imaging-session":
      unitAmount = 100 * 100;
      productName = "Okie-Tex PixInsight Imaging Session";
      break;
    default:
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Unknown item" }) };
  }

  // Initialized inside the handler so test mocks can intercept require('stripe')
  const stripe = require("stripe")(process.env.STRIPE_SK);
  const baseUrl = process.env.URL || "http://localhost:8888";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: productName },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email || undefined,
      metadata: {
        name: name || "",
        email: email || "",
        item,
        address: address || "",
        city: city || "",
        state: state || "",
        zip: zip || "",
      },
      success_url: `${baseUrl}/success?item=${item}&name=${encodeURIComponent(name || "")}`,
      cancel_url: item === "imaging-session" ? `${baseUrl}/imaging-session` : `${baseUrl}/`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

// Exported for testing
exports.getMembershipPrice = getMembershipPrice;
exports.MEMBERSHIP_PRICES = MEMBERSHIP_PRICES;
