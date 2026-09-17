/**
 * Demo mode — the statically exported build published to GitHub Pages so the
 * client can click through the site without a server behind it.
 *
 * Pages cannot run Server Actions, read cookies, or reach a database at
 * request time, so in this mode:
 *   - checkout and the enquiry forms show their success states without saving
 *   - the admin is a read-only walkthrough of the seeded catalogue
 *   - the order confirmation shows a sample order
 *
 * Everything the customer *sees* is the real UI. Only persistence is missing.
 * The normal build (`npm run build`) is unaffected — see next.config.ts.
 */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

/** Order number pre-rendered for the demo confirmation page. */
export const DEMO_ORDER_NUMBER = "SC-DEMO01";

/** A believable basket, used when there is no database to read from. */
export const DEMO_ORDER = {
  orderNumber: DEMO_ORDER_NUMBER,
  customerName: "Aline Uwase",
  customerPhone: "0788 123 456",
  customerEmail: "aline@example.rw" as string | null,
  fulfillment: "DELIVERY",
  deliveryZone: "CENTRAL" as string | null,
  deliveryFeeRwf: 2000,
  address: "House 12, KG 7 Ave, near the Kimihurura roundabout" as string | null,
  requestedDate: new Date("2026-08-14T00:00:00.000Z"),
  timeWindow: "10:00 — 12:00",
  notes: 'Please pipe "Happy Birthday Keza" on the cake.' as string | null,
  subtotalRwf: 60000,
  totalRwf: 62000,
  status: "CONFIRMED",
  items: [
    {
      id: "demo-1",
      nameSnapshot: "Classic Birthday Cake",
      variantName: "8 inch — serves 15–20",
      unitPriceRwf: 40000,
      quantity: 1,
      lineTotalRwf: 40000,
    },
    {
      id: "demo-2",
      nameSnapshot: "Butter Croissant",
      variantName: null,
      unitPriceRwf: 3000,
      quantity: 4,
      lineTotalRwf: 12000,
    },
    {
      id: "demo-3",
      nameSnapshot: "Chocolate Chip Cookie",
      variantName: null,
      unitPriceRwf: 2000,
      quantity: 4,
      lineTotalRwf: 8000,
    },
  ],
};

/** Banner copy shown across the demo so nobody mistakes it for the live shop. */
export const DEMO_NOTICE =
  "Preview build — you can browse everything, but orders and messages are not saved.";
