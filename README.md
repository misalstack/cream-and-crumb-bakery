# Sweet Crust

> *A Heart of Bakery in Africa*

An online bakery for **Sweet Crust**, Kigali — customers browse breads, cakes and pastries,
build a cart, and place an order for pickup or delivery. Staff manage the catalogue and
incoming orders from a built-in admin area.

Built from the client's brief (`Sweet_Crust_Ecommerce_Website_Plan_Updated.pdf`): deep
burgundy and champagne gold, blush and ivory supporting tones, a stylish display serif over
clean body text, and large food photography throughout.

---

## Running it

```bash
npm install
```

Create `.env` in the project root:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-to-a-long-random-string"
```

Then set up the database and start the dev server:

```bash
npx prisma migrate dev && npx tsx prisma/seed.ts && npm run dev
```

The site runs at **http://localhost:3002** (`npm run dev -- --port 3002`).

Staff sign in at `/admin/login`. The seeded development account is
`owner@sweetcrust.rw` / `sweetcrust123` — **change this before the site goes live**
(see the checklist below).

### Other commands

| Command | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check |
| `npx tsx prisma/seed.ts` | Re-seed the catalogue (safe to re-run — upserts by slug) |
| `npx tsx scripts/fetch-photos.ts` | Re-download any missing placeholder photos |
| `npx tsx scripts/contact-sheet.ts` | Build `public/_contact-sheet-N.html` to eyeball all photos at once |
| `npx tsx scripts/verify-images.ts` | Check every image the database references still exists |
| `npx tsx scripts/reset-demo-data.ts` | Wipe orders/enquiries after a demo, keeping the catalogue |

---

## What's on the site

**Public**

- **Home** — hero with the logo, slogan and the two CTAs the brief asks for (**Order Now**
  and **Patisserie Menu**), category tiles, bestsellers, the bakery's story, a custom-cake
  band, testimonials, a gallery strip and visiting details.
- **Patisseries** (`/patisseries`) — the full menu with category filters, search, sorting
  and sold-out states. Each product card carries a photo, description, price, quantity
  selector and Add to Cart.
- **Product page** (`/patisseries/[slug]`) — large photography, size options for cakes,
  allergens, notice period, and related items.
- **Cart & checkout** (`/cart`) — quantity steppers, pickup vs delivery with Kigali zone
  fees, date and time window, then a saved order.
- **Order confirmation** (`/order/[orderNumber]`) — a receipt plus a WhatsApp button that
  opens a pre-written message summarising the order.
- **Custom Cakes** (`/custom-cakes`) — how it works, pricing guidance, FAQ and an enquiry form.
- **Gallery** (`/gallery`) — filterable grid with a keyboard-navigable lightbox.
- **Contact** (`/contact`) — address, hours, delivery zones, map, contact form and FAQs.

**Admin** (`/admin`)

Dashboard (orders due today, open orders, month revenue, things needing a reply),
orders list with filters, order detail with a status dropdown, product create/edit with
sizes and stock toggles, plus custom-cake and message inboxes.

Order statuses run `Pending → Confirmed → In the oven → Ready → Out for delivery →
Completed`, with `Cancelled` available at any point.

---

## How it's built

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma + SQLite · no UI kit.

```
prisma/
  schema.prisma      Data model
  catalog.ts         The seed catalogue (42 products) — shared with the photo fetcher
  seed.ts            Writes the catalogue, gallery and staff account
scripts/             Dev tools: photo fetching, contact sheet, demo-data reset
src/app/(site)/      Public site
src/app/admin/       Staff area — login is a sibling of the (protected) group
src/components/      UI primitives, cart, forms, admin widgets
src/lib/             Data access, currency, validation, auth, bakery details
```

A few decisions worth knowing:

- **Prices are stored in RWF only.** USD is derived at render time from `RWF_PER_USD` in
  `src/lib/currency.ts`; the visitor's choice lives in a `currency` cookie read on the
  server. With 40-plus products one exchange rate is far less error-prone than maintaining
  two prices per row. **Update that rate when it moves.**
- **The cart is browser-only** (`localStorage`, no customer accounts), but **the server
  re-prices every line from the database at checkout**. Prices in the browser are display
  values and are never trusted.
- **Forms are controlled.** React resets a form once a Server Action resolves, which
  otherwise wipes what a customer typed on a validation error — and on checkout it silently
  reverted delivery orders to pickup. See `src/components/forms/useFormFields.ts`.
- **Order line items snapshot the name and price**, so a receipt from last month stays
  accurate after a product is renamed or repriced. Deleting a product retires it
  (`isActive: false`) rather than removing the row.
- **Dark mode** follows the visitor's system setting with a manual override. `cream-*` and
  `ink-*` flip between modes, `accent`/`positive`/`negative` flip so brand and status text
  stays readable on both, and `paper-*`/`wine-*`/`gold-*` are pinned for fills and
  always-dark chrome. See `CLAUDE.md` for which to reach for.

---

## Client content checklist

Everything below is **placeholder** and needs the client's real material before launch.
Each item says exactly where it lives.

- [ ] **Logo** — `src/components/BrandLogo.tsx` currently draws a stand-in roundel. Drop the
      real file at `public/brand/logo.svg` and follow the swap instructions in the comment at
      the top of that file. Nothing else needs to change.
- [ ] **Photography** — all 56 images in `public/images/` are openly-licensed stand-ins,
      credited in `public/images/CREDITS.md`. Replace a file **in place** (same path, same
      name) and the site picks it up with no code change. This matters most on the home hero
      (`feature/hero-main.jpg`) and the product shots.
- [x] **Phone / WhatsApp** — `+250 787 458 190` is the client's real number and is already
      wired into every `wa.me` and `tel:` link (`src/lib/bakery-info.ts`). Split
      `phoneDisplay` from `whatsappNumber` in that file if calls should go to a different
      line from WhatsApp.
- [ ] **Remaining contact details** — `src/lib/bakery-info.ts`: email, address, map location
      and social links are still invented.
- [ ] **Opening hours and delivery zones** — same file. Confirm the zones and fees match
      what the bakery actually charges.
- [x] **Menu and prices** — `prisma/catalog.ts` now holds the client's **real** menu: 15
      pastries, 9 celebration cakes and 5 boxes, at the recommended retail prices from
      `IRIE_VIANDS_Pastry_and_Celebration_Cake_Menu.pdf`. Cake sizes and wedding tiers are
      in as variants; flavours and wedding styles are in `src/lib/cake-options.ts`.
      ⚠️ That file is the source of truth — **re-seeding deletes products added through
      `/admin/products`**, so add anything permanent to the catalogue too.
- [ ] **Product descriptions** — written to fit the range but not client-approved.
- [ ] **Testimonials** — the three quotes on the home page are written, not real. They are in
      the `TESTIMONIALS` array in `src/app/(site)/page.tsx`.
- [ ] **Exchange rate** — `RWF_PER_USD` in `src/lib/currency.ts`.
- [ ] **Staff account** — change the seeded password, or create the real owner account and
      delete `owner@sweetcrust.rw`.
- [ ] **`JWT_SECRET`** — set a long random value in production. The development fallback is
      not safe to ship.
- [ ] **Domain** — set `NEXT_PUBLIC_SITE_URL` so the sitemap, robots.txt and share cards
      point at the real domain (currently defaults to `https://sweetcrust.rw`).

---

## Not built yet

Deliberately out of scope for this pass, in rough priority order:

1. **Online payment.** Checkout saves the order and hands off to WhatsApp for confirmation
   and payment — the way most Kigali bakeries already work, and it needs no merchant
   account. MTN MoMo or Flutterwave can be added at `src/app/(site)/cart/actions.ts` without
   disturbing the rest of the flow.
2. **Customer accounts and order history** — ordering is guest-only today.
3. **Email/SMS notifications** — the bakery currently learns about an order from the admin
   dashboard or the customer's WhatsApp message.
4. **Product reviews**, loyalty and subscription boxes.
5. **French translation** — the site is English-only.

---

## The static preview (GitHub Pages)

A click-through copy of the site is published to GitHub Pages so the client can
browse it without a server:

**https://nkennyelvis.github.io/sweet-crust/**

GitHub Pages serves static files only — it cannot run Server Actions, read cookies, or
reach a database. So the preview build swaps those for stand-ins:

| Live site | Static preview |
| --- | --- |
| Checkout saves an order | Shows a sample confirmation; nothing is stored |
| Contact / custom-cake forms save | Show their success state only |
| Staff login checks a password | Any details get you in |
| Admin status toggles update the database | Rendered read-only |
| Category / search / sort filter on the server | Filter in the browser |
| Prices switch RWF ↔ USD via a cookie | RWF only |

Everything else — every page, all 42 products, the cart, the photography — is the real
thing. A gold banner across the top says so, and the browser cart genuinely works.

Rebuild and republish it with:

```bash
npm run demo:deploy
```

That seeds sample orders and enquiries (`prisma/seed-demo.ts`) so the admin walkthrough
isn't empty, builds with `DEMO_EXPORT=1`, and pushes `out/` to the `gh-pages` branch.
The demo-only code lives in `src/demo/` and is switched on by `next.config.ts`; nothing
in the normal build path changes.

## Deploying

Any Node host works. For a platform without a persistent disk (Vercel and similar), switch
the Prisma datasource from `sqlite` to `postgresql` and point `DATABASE_URL` at a hosted
database — no application code needs to change. Set `JWT_SECRET` and
`NEXT_PUBLIC_SITE_URL`, then run the migration and seed once against the production
database.
