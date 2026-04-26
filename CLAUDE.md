# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Astro dev server (frontend only; Netlify Functions don't run here)
- `netlify dev` — runs Astro + Netlify Functions together; required for testing payment flows end-to-end
- `npm run build` — production build to `dist/`
- `npm test` — runs Vitest once (no watch). Use `npx vitest <file>` to run a single test file, or `npx vitest -t "<name>"` to filter by test name.
- Node 20 (see `.nvmrc`)

## Architecture

Static Astro 4 site (SSG) on Netlify, with two CommonJS serverless functions in `netlify/functions/` handling payments. There is no application server — every dynamic interaction goes through Stripe + a Netlify Function.

### Module systems split

- The Astro app (`src/`, `astro.config.mjs`, etc.) is **ESM** — `package.json` has `"type": "module"`.
- Netlify Functions are **CommonJS** with `.cjs` extensions (`require`, `module.exports`). Keep them `.cjs` — the project's ESM default would otherwise break them.
- Vitest tests use ESM and import the `.cjs` functions via dynamic `import()` (see `tests/create-checkout-session.test.js`).

### Payment flow (both items share one pipeline)

1. **Browser** (`src/pages/index.astro` for `membership`, `src/pages/imaging-session.astro` for `imaging-session`) submits the registration form, then `fetch`es `/.netlify/functions/create-checkout-session` with `{ name, email, item, ... }`.
2. **`create-checkout-session.cjs`** dispatches on `item` (only `membership` and `imaging-session` are valid), creates a Stripe `PaymentIntent` server-side using `STRIPE_SK`, and returns a `clientSecret`. Customer fields are stuffed into PaymentIntent `metadata` so the webhook can read them later (no DB).
3. **Browser** mounts Stripe Elements (`@stripe/stripe-js` loaded globally in `Layout.astro`) using `import.meta.env.PUBLIC_STRIPE_PK`, confirms payment, and is redirected to `/success`.
4. **Stripe webhook** → **`confirm-stripe-payment.cjs`** — verifies signature with `STRIPE_ES`, reads `metadata.item`, then sends a SendGrid dynamic-template email (`MEMBERSHIP_TEMPLATE_ID` or `IMAGING_TEMPLATE_ID`, hard-coded at the top of the file). On SendGrid failure, an alert email goes to `SENDGRID_ERROR_RECIPIENT` if set.

The webhook is the source of truth for "payment succeeded" — `/success` is just a confirmation page driven by `localStorage`, never trust it for fulfillment logic.

### Pricing — duplicated price table (intentional)

Membership pricing is pro-rated by month: `[45, 42, 39, 36, 33, 30, 27, 24, 21, 18, 15, 12]` (Jan→Dec). This array exists in **two places** that must stay in sync:

- `src/assets/data/getPrice.js` — used by the Astro page to render the price
- `netlify/functions/create-checkout-session.cjs` (`MEMBERSHIP_PRICES`) — the authoritative server-side amount Stripe charges

`tests/create-checkout-session.test.js` has a test that calls both and asserts equality — if you change one, change the other and run the tests. Imaging-session price is hard-coded at $100 (10000 cents) in the function.

### Environment variables

- **Server-only** (Netlify dashboard + local `.env`): `STRIPE_SK`, `STRIPE_ES` (webhook signing secret), `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_FROM_OTSP` (optional, falls back to `SENDGRID_FROM`), `SENDGRID_BCC`, `SENDGRID_ERROR_RECIPIENT`.
- **Client-exposed** (must use `PUBLIC_` prefix per Astro): `PUBLIC_STRIPE_PK`. The legacy `VITE_STRIPE_PK` / `VITE_BASE_URL` names are dead — there's a comment at the top of `create-checkout-session.cjs` reminding about the rename.

### Styling

- Tailwind via `@astrojs/tailwind` with `applyBaseStyles: false` — base styles live in `src/styles/global.css` (loaded by `Layout.astro`).
- Custom design tokens are in `tailwind.config.js` under the `ds-*` namespace (`bg-ds-bg`, `text-ds-gold`, etc.). Prefer these over raw hex values.
- Reusable component classes (`.btn-primary`, `.form-input`, `.segment-card`) are defined in `global.css` `@layer components` — use them rather than reinventing button/input styles.
- Fonts (Lusitana for display, Raleway for body) are self-hosted from `public/fonts/`. Space Mono is the only external font (Google Fonts, loaded in `Layout.astro`).
- Full brand/voice/visual reference lives in `design-system/README.md` — consult it for new pages or copy.

### Pages

Astro file-based routing in `src/pages/`:
- `index.astro` — home + membership registration + Stripe modal
- `imaging-session.astro` — Okie-Tex PixInsight Workshop registration + payment ($100)
- `observing.astro` — monthly observing guide; data driven by `src/assets/data/observingTargets.js` with month-selector client-side filtering
- `success.astro` — post-payment confirmation page

All pages share `src/layouts/Layout.astro`, which loads Stripe.js globally so payment pages don't need their own script tag.

## Notes

- `CLAUDE.md` and `.claude/` are gitignored — this file is local-only.
- `vite.config.js` is leftover from a pre-Astro era and isn't used by the Astro build; don't rely on it.
