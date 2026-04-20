# Okie-Tex Companion Site

React 18 SPA for Oklahoma City Astronomy Club — handles member registration and imaging session (PixInsight workshop) registration with Stripe payments. Deployed on Netlify with serverless functions. This is a **companion** to the main Okie-Tex website — do not modify or reference the legacy PHP site.

## Commands

```bash
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build locally
netlify dev       # Run with Netlify Functions locally (required to test Stripe/SendGrid)
```

No test suite or linter configured.

## Environment Variables

Never hardcode keys. All secrets live in `.env` (local, not committed) and Netlify environment variables (production).

- `VITE_BASE_URL` — Base URL for Netlify function calls
- `VITE_STRIPE_PK` — Stripe publishable key (client-safe)
- `STRIPE_SK` — Stripe secret key (Functions only)
- `STRIPE_ES` — Stripe webhook signing secret (Functions only)
- `SENDGRID_API_KEY` (Functions only)
- `SENDGRID_FROM`, `SENDGRID_FROM_OTSP`, `SENDGRID_BCC`, `SENDGRID_MEMBERSHIP`, `SENDGRID_ERROR_RECIPIENT`

## Architecture

**Stack:** React 18 + React Router v6, Chakra UI (primary), Tailwind CSS (utility fallback), Vite 4, Stripe, SendGrid. Netlify Functions as CommonJS `.cjs` files in `/netlify/functions/`.

**Routes:**

- `/` → Member registration + payment
- `/observing` → Monthly night sky observing guide
- `/imaging-session` → PixInsight workshop registration + payment
- `/success` → Post-payment confirmation (reads localStorage)

**Component structure** (`src/` uses atomic-style with barrel exports via `index.js`):

- `pages/` — Route-level components
- `organisms/` — Complex features (`RegForm`, `CheckoutForm`, `ImagingSessionForm`, `Navigation`)
- `molecules/` — Reusable form pieces (`FormInputField`, `FormSelectField`, `Form`)
- `components/` — Single-purpose UI elements
- `templates/` — Layout wrappers (`Page`, `Segment`, `StripeCheckout` modal, `TargetTable`)
- `assets/data/` — Static data and utilities

## Payment Flow

1. User submits form → POSTs to `/.netlify/functions/create-payment-intent`
2. Function calculates price, creates Stripe PaymentIntent, returns `clientSecret`
3. `StripeCheckout` modal opens with Stripe's `PaymentElement`
4. On success, Stripe redirects to `/success`; member data saved to `localStorage` by `CheckoutForm`
5. `confirm-stripe-payment.cjs` webhook fires on `payment_intent.succeeded` → sends SendGrid confirmation

## State Management

`useState` only — no global state. Only cross-page persistence is a single `localStorage` entry written by `CheckoutForm` and read by `Success`.

## Content Workflow

Page content lives in the Obsidian vault at `../obsidian-vault/content/` (relative to repo root). When updating page copy, read from those markdown files rather than editing JSX strings directly. The mapping is:

- `content/home.md` → `src/pages/` member registration page
- `content/observing.md` → `src/pages/` observing guide page
- `content/imaging.md` → `src/pages/` imaging session page

If a page component exists in `src/pages/` but has no corresponding file in `content/`, extract the page's display text and save it to the appropriate `content/*.md` file before making edits. Do not edit JSX string content directly.

## Gotchas

- Always validate Stripe webhook signatures in `confirm-stripe-payment.cjs` — never skip this
- Netlify Functions are CommonJS (`.cjs`) — do not use ES module `import` syntax in them
- `VITE_` prefix required for any env var accessed in React client code; never expose `STRIPE_SK` or `SENDGRID_API_KEY` to the client
- `getPrice.js` is used in both frontend and Netlify function — changes affect both; test both sides
- Chakra UI handles all layout via props — no separate CSS files; use Chakra's array syntax for responsive breakpoints
- SendGrid is only called from Netlify Functions, never from client-side code
