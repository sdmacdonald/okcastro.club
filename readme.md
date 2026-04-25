# Oklahoma City Astronomy Club — okcastro.club

## Stack

- **Hosting:** Netlify (static site + serverless functions)
- **Frontend:** Astro 4 (static site generation)
- **Styling:** Tailwind CSS with custom design system (dark mode, Lusitana/Raleway fonts)
- **Backend:** Node.js via Netlify Functions (CommonJS `.cjs`)
- **Tests:** Vitest

## Integrations

- **Stripe** — in-page payment modal (PaymentIntents + Stripe Elements)
- **SendGrid** — post-payment confirmation emails via webhook
- **Netlify Functions** — `create-checkout-session.cjs`, `confirm-stripe-payment.cjs`

## Pages

- `/` — OKCAC member registration + Stripe payment
- `/observing` — Monthly night sky observing guide (Rod Gallagher)
- `/imaging-session` — Okie-Tex PixInsight Workshop registration + payment
- `/success` — Post-payment confirmation

## Contact

webmaster@okcastroclub.com
