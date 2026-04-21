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

## Key env vars (Netlify dashboard + local `.env`)

- `STRIPE_SK` — Stripe secret key
- `PUBLIC_STRIPE_PK` — Stripe publishable key (client-safe, `PUBLIC_` prefix required for Astro)
- `STRIPE_ES` — Stripe webhook signing secret
- `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_FROM_OTSP`, `SENDGRID_BCC`, `SENDGRID_MEMBERSHIP`, `SENDGRID_ERROR_RECIPIENT`

## Contact

Danny MacDonald, newsletter editor, Oklahoma City Astronomy Club
editor@okcastroclub.com
