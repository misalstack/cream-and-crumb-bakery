<div id='top' align="center">

# 🧁 Crème & Crumb

### Premium Patisserie & Ordering Platform

An all-in-one modern e-commerce platform and management portal for luxury bakery and confectionery businesses. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **PostgreSQL**.


<p>

![Next.js](https://img.shields.io/badge/-Next.js-05122A?style=for-the-badge&logo=next.js)&nbsp;
![TypeScript](https://img.shields.io/badge/-TypeScript-05122A?style=for-the-badge&logo=typescript)&nbsp;
![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-05122A?style=for-the-badge&logo=tailwindCSS&logoColor=06B6D4)&nbsp;
![Prisma](https://img.shields.io/badge/-Prisma-05122A?style=for-the-badge&logo=prisma)&nbsp;
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-05122A?style=for-the-badge&logo=postgresql)

</p>

## 🔗 Live Demo

You can explore the live deployed platform here:
👉 **[Crème & Crumb Live Storefront](https://weet-crust.vercel.app)**
</div>

---

## 🔧 Technologies

* **Framework:** Next.js (App Router, Server Actions)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database & ORM:** Prisma ORM with PostgreSQL & SQLite
* **Typography & Design System:** Custom high-contrast theme (Cormorant Garamond, Parisienne, Inter)

---

## ✨ Key Features & Capabilities

* 🎂 **Guided 4-Step Custom Cake Pipeline:** Seamless inquiry system capturing party size, budget, reference photos, custom messages, and baking vision (`Vision → Design → Confirmation → Baking`).
* 🛒 **Category-Filtered Visual Showcase:** Dynamic catalog with multi-tier flavor menus across "The Bakery", "Pastries", and "Cakes".
* 🔒 **Staff Back-Office Portal & Soft-Deletion:** Admin dashboard for complete menu management. Features soft-deletion logic (`isActive: false`) to discontinue products without corrupting historical sales records.
* 💬 **Direct Order & WhatsApp Integration:** Inline contact and direct WhatsApp ordering routes allowing customers to discuss complex custom requests directly with staff.
* 📱 **Responsive Multi-Step Order Processing:** Optimized for high engagement and flawless mobile/desktop ordering workflows.

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

