# Okie-Tex Star Party — Design System

## Overview

**Okie-Tex Star Party (OTSP)** is an annual 9-night astronomical event hosted by the **Oklahoma City Astronomy Club (OKCAC)**, held under some of the darkest skies in the continental US in the far Oklahoma Panhandle — near Black Mesa, the highest point in Oklahoma. Founded in 1958, OKCAC serves metro Oklahoma City amateur astronomers of all skill levels. OTSP brings hundreds of attendees to wide-open mesa landscape for inky black skies, deep-sky observing, astrophotography, and workshops.

The club's mascots are two pink flamingos: **Okie** and **Tex**.

**Website:** [okcastro.club](https://okcastro.club)

---

## Sources

- **Codebase:** `sdmacdonald/okcastro.club` (GitHub) — React + Vite + Chakra UI v2 + Tailwind CSS. Deployed to Netlify. Stripe + Firebase integrations for registration/payments.
- **Assets imported:** See `assets/` — logos, background photos.
- **No Figma file provided.**

---

## Products / Surfaces

1. **OKCAC Website** (`okcastro.club`) — Public-facing marketing + registration site. Core pages:
   - **Home / Register** — Club intro + new member registration (Stripe)
   - **Night Sky Observing** — Monthly observing guide with filterable target tables (by Rod Gallagher)
   - **Imaging Session** — Okie-Tex PixInsight Workshop registration + info
   - **Success** — Payment confirmation

---

## CONTENT FUNDAMENTALS

### Voice & Tone
- **Serious but approachable.** This is a science hobby org, not a social media brand. Copy is informative first.
- **Occasional dry wit / snark.** A well-placed joke lands, but it's never corny.
- **No hype.** No exclamation points used gratuitously. The skies speak for themselves.
- **Expert-to-expert.** Assumes the reader is at least curious about astronomy. Technical terms used without apology (PixInsight, Master Observer, CCD, etc.)
- **Texan-adjacent warmth.** Laid back, wide open, unhurried. Like the mesa itself.

### Casing & Grammar
- **Sentence case** for headings: "Explore the night sky with us." not "Explore The Night Sky With Us."
- Titles and proper nouns capitalized normally.
- **No ALL CAPS** for emphasis — use weight or color.

### Pronouns
- Second person ("you," "your") for registration/action copy.
- Third person for event/speaker bios.
- First person plural ("we") for the club itself: "We use telescopes, binoculars, cameras and our own eyes."

### Emoji
- **Not used.** The brand is too dry and serious for emoji.

### Copy Examples (from codebase)
- "Explore the Night Sky with Us." *(h1, Register page)*
- "The Oklahoma City Astronomy Club has been helping metro area residents observe the wonders and mysteries of our night sky since 1958."
- "Okie-Tex PixInsight Imaging Workshop. Now back for a SEVENTH year!" *(the ALL CAPS here is rare, for emphasis)*
- "Night Sky Observing: October — by Rod Gallagher, Master Observer"
- "Each seat is $100 per person. You must be registered for the Okie-Tex Star Party to attend." *(direct, no fluff)*

---

## VISUAL FOUNDATIONS

### Color
Dark mode always. The palette is inspired by **mesa sunsets**: deep golds, burnt oranges, dusty pinks, midnight blues, and near-black grounds. See `colors_and_type.css` and `preview/` cards for full palette.

- **Background:** Near-black with warm blue-grey tint (`#0d0f18`, `#111421`)
- **Surface / Card:** Dark navy (`#161b2e`, `#1c2340`)
- **Nav:** Deep navy (`#152033` — Chakra `blue.800` = `#2c5282` in source, but design system extends darker)
- **Primary accent — Gold:** `#e8a020` — headlines, CTAs, star glints
- **Secondary accent — Orange:** `#d4621a` — warmth, hover states
- **Tertiary accent — Flamingo Pink:** `#e8608a` — mascot color, occasional highlight
- **Sky Blue:** `#7ab4e0` — links, info, cool contrast
- **Text Primary:** `#f0ece4` (warm white)
- **Text Secondary:** `#9ea3b0` (muted lavender-grey)
- **Text Dim:** `#5c6070`

### Typography
No custom fonts in the source codebase (Chakra UI defaults to Inter/system). This design system specifies:
- **Display / Headings:** *Lusitana Bold* (700) — bold serif with gravitas. Local files: `fonts/Lusitana-Bold.ttf`, `fonts/Lusitana-Regular.ttf`.
- **Body:** *Raleway* — clean, elegant sans-serif. Local variable files: `fonts/Raleway-VariableFont_wght.ttf` (upright), `fonts/Raleway-Italic-VariableFont_wght.ttf` (italic).
- **Mono:** *Space Mono* — on-brand for data tables, code, coordinates. Served from Google Fonts (only remaining external dependency; provide `.ttf` to fully self-host).

All fonts are **fully self-hosted** except Space Mono.

### Backgrounds
- Full-bleed photographic backgrounds with dark overlay gradients (linear-gradient over night sky / mesa photos)
- Two main background images: `bg.jpg` (starfield/mesa) and `M33-rod-gallagher.jpg` (galaxy)
- Overlay style: `linear-gradient(rgba(13,15,24,0.85), rgba(13,15,24,0.65))` over photo
- Cards/segments sit on top of background with semi-transparent dark surface

### Spacing & Layout
- Max content width: ~976px centered
- Section padding: `p-10` (40px) from Chakra
- Cards/segments use `m-6` (24px) margin
- Tight spacing within form fields; generous spacing between sections

### Cards
- Dark navy background (`#161b2e`) with subtle border (`1px solid rgba(255,255,255,0.08)`)
- `border-radius: 8px` (md)
- Subtle `box-shadow: 0 4px 24px rgba(0,0,0,0.5)`
- No colored left-border accents

### Borders & Dividers
- `1px solid rgba(255,255,255,0.12)` — very subtle on dark surfaces
- Divider under h1 headings in Segment components

### Shadows
- Cards: `0 4px 24px rgba(0,0,0,0.5)`
- Nav: `0 2px 8px rgba(0,0,0,0.6)`
- Elevated overlays/modals: `0 8px 48px rgba(0,0,0,0.7)`

### Corner Radii
- Buttons: `4px` (sm)
- Cards/segments: `8px` (md)
- Form inputs: `4px`
- No pill/fully-rounded shapes except tags/badges

### Animation
- Framer Motion is a dependency but used sparingly. No splashy entrances.
- Hover: color shift (not scale/bounce)
- Transitions: `200ms ease`
- No parallax, no particle effects

### Hover & Press States
- Links/buttons: color lightens slightly on hover, stays same hue
- Nav icons: opacity 0.7 → 1.0 on hover
- Buttons: slightly lighter background on hover; scale(0.98) on press
- No glow effects

### Iconography (see ICONOGRAPHY section)
- Feather Icons via `react-icons/fi`
- Font Awesome via `react-icons/fa`
- GitHub Octicons via `react-icons/go`
- Icons used as simple outline strokes, no fills, no backgrounds
- Size: 20–24px in nav; 16px inline

### Imagery
- **Color vibe:** Cool-warm contrast — deep cold blues in shadows, warm gold/orange highlights. High contrast. Minimal grain.
- **Subject matter:** Night sky, galaxies, star fields, observatory landscapes, mesa/panhandle terrain.
- **No illustration** — photo-only for hero images.

---

## ICONOGRAPHY

The site uses **react-icons** (v4) — a React wrapper around multiple icon sets. No custom icon font or SVG sprite.

**Icon sets in use:**
- `react-icons/fi` — **Feather Icons** (outline, 1.5px stroke) — mail icon in nav
- `react-icons/fa` — **Font Awesome** — GitHub icon in nav
- `react-icons/go` — **GitHub Octicons** — telescope icon in nav (`GoTelescope`)
- `@chakra-ui/icons` — Chakra built-ins — `ExternalLinkIcon`, `AccordionIcon`

**CDN equivalent:** For this design system (non-React), use [Lucide Icons](https://lucide.dev) as a Feather-compatible substitute. Same stroke weight / outline style.

**Usage rules:**
- Icons always inline, never in boxes or background containers
- Color: inherit from parent (usually `text-secondary` or accent)
- Size: 20px in navigation; 16px inline in text; 24px for feature icons
- No icon labels in nav — icon-only with title attributes

**Logos:**
- `assets/okcac-logo__white.png` — White version for dark backgrounds (125px wide in nav)
- `assets/okcac-logo__black.png` — Black version for light backgrounds
- No SVG version found in repo

---

## FILE INDEX

```
README.md                        — This file
SKILL.md                         — Agent skill definition
colors_and_type.css              — CSS custom properties: colors, typography, spacing
assets/
  okcac-logo__white.png          — OKCAC logo, white (for dark backgrounds)
  okcac-logo__black.png          — OKCAC logo, black (for light backgrounds)
  bg.jpg                         — Mesa/starfield background photo
  M33-rod-gallagher.jpg          — M33 galaxy photo (by Rod Gallagher)
preview/
  colors-base.html               — Base color palette swatches
  colors-semantic.html           — Semantic color tokens
  type-scale.html                — Typography scale specimen
  type-specimens.html            — Body + mono type specimens
  spacing-tokens.html            — Spacing, radius, shadow tokens
  components-buttons.html        — Button variants
  components-forms.html          — Form input states
  components-cards.html          — Card + segment patterns
  components-nav.html            — Navigation bar
  brand-logos.html               — Logo usage
  brand-backgrounds.html         — Background treatments
ui_kits/
  website/
    README.md                    — Website UI kit notes
    index.html                   — Interactive prototype (Register + Observing + Imaging pages)
    Nav.jsx                      — Navigation component
    Page.jsx                     — Page wrapper with bg
    Segment.jsx                  — Content segment/card
    Buttons.jsx                  — Button components
    Forms.jsx                    — Form components
```
