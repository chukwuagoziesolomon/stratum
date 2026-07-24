# Stratum Energy Partners

A Next.js 14 (App Router) investment site for a legitimate oil & gas / energy infrastructure
investment firm — marketing site, auth (login/signup), an investor dashboard, an account
settings area, and an AI customer support chat widget.

## Design direction

- **Palette:** warm near-black "crude" base (`#0A0908`), flare-orange primary accent (`#FF6B35`,
  used for CTAs and the animated flare-stack flame), brass/gold secondary accent (`#D99A3D`), warm
  sand text (`#F3EDE2`). Risk levels in the funds section run cool-to-hot (steel blue → gold →
  flare orange) from conservative to aggressive.
- **Type:** Oswald (display, condensed industrial/stencil feel — used uppercase for the hero
  headline and nav tagline), Source Serif 4 (body, for readability and trust), IBM Plex Mono
  (data/ticker/labels).
- **Signature visuals:**
  - A fully custom, hand-built animated SVG hero illustration (`components/RigIllustration.tsx`):
    a pumpjack with a rocking walking-beam, a flare stack with a flickering flame and rising
    smoke, a distant refinery skyline with twinkling lights. Built as vector art rather than
    stock photography — hotlinked/scraped photos would carry licensing risk on a real commercial
    site and can break if the source moves; this also keeps the whole hero dependency-free and
    themeable.
  - The "core sample" visual on the funds/services sections — each fund shown as a stratified
    core tube, where depth = duration and color = risk band.
  - A riveted "pipe-seam" divider (`.pipe-seam` in `globals.css`) used between sections instead of
    a plain border.
  - A film-grain overlay (`.grain-overlay`) on dark hero sections for texture.
- An explicit "Oil & Gas Investment Firm" badge sits in both the top nav strip and the hero on
  every page load, so there's no ambiguity about the industry.
- Real, honest copy throughout: historical return **ranges** (not fixed guarantees), explicit risk
  disclosures on the signup flow and every funds section, and disclaimers in the footer.

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## AI customer support

The floating chat widget (`components/ChatWidget.tsx`) calls `app/api/chat/route.ts`, which proxies
to the Claude API server-side using `ANTHROPIC_API_KEY` from your environment — the key is never
exposed to the browser. Without a key set, the widget still renders and tells the visitor support
isn't fully configured yet, instead of failing silently.

The assistant's system prompt (in `route.ts`) is deliberately conservative for a regulated
industry: it never promises guaranteed returns, and defers personalized investment/tax/legal
advice to a human advisor via the Contact page.

## Structure

```
app/
  layout.tsx              # root layout (fonts, chat widget)
  globals.css
  (marketing)/             # public site — shares Navbar + Footer
    layout.tsx
    page.tsx                # home
    about/  services/  portfolio/  contact/  faq/
  login/  signup/           # full-bleed auth screens, no nav/footer
  (dashboard)/              # authenticated area — shares Sidebar
    layout.tsx
    dashboard/               # overview, holdings, transactions, documents
    settings/                # profile, security, notifications, payout, danger zone
  api/chat/route.ts         # server-side Claude proxy for support chat
components/                # Navbar, Footer, Hero, CoreSample, ChatWidget, Sidebar, etc.
lib/data.ts                 # fund/program, project, testimonial, FAQ content
```

## Notes for going to production

- **Auth is not wired to a real backend.** `login` and `signup` currently simulate a network call
  and redirect straight to `/dashboard`. Before launch, connect them to a real auth
  provider/database (NextAuth, Clerk, Supabase Auth, or a custom API) with proper password
  hashing, session cookies, and CSRF protection.
- **Dashboard and settings data are static/mock.** Wire `lib/data.ts` and the dashboard/settings
  pages to your real accounts, holdings, and transactions API.
- **Compliance review:** this is a template. Before launch, have counsel review all return-range
  claims, risk disclosures, and jurisdiction-specific securities requirements for wherever you
  plan to accept investors from.
