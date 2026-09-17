// ⚠️ MOSTLY PLACEHOLDER — the phone/WhatsApp number below is REAL. Every other
// field is invented and must be replaced with Sweet Crust's real details
// before the site goes live. See the "Client content checklist" in README.md.
export const BAKERY_INFO = {
  name: "Sweet Crust",
  tagline: "A Heart of Bakery in Africa",
  // Real number, supplied by the client. `phoneDisplay` drives the tel: links
  // and `whatsappNumber` the wa.me links — split them if calls should go to a
  // different line from WhatsApp.
  phoneDisplay: "+250 787 458 190",
  whatsappNumber: "250787458190", // digits only, no "+", for wa.me links
  email: "hello@sweetcrust.rw",
  address: "KN 4 Ave, Nyarugenge, Kigali, Rwanda",
  mapsQuery: "Nyarugenge, Kigali, Rwanda",
  instagram: "https://instagram.com/sweetcrust.rw",
  facebook: "https://facebook.com/sweetcrust.rw",
  tiktok: "https://tiktok.com/@sweetcrust.rw",
};

export const OPENING_HOURS = [
  { days: "Monday – Friday", hours: "6:30 — 20:00" },
  { days: "Saturday", hours: "7:00 — 21:00" },
  { days: "Sunday", hours: "8:00 — 18:00" },
];

/** Pickup and delivery slots the kitchen can actually staff. */
export const TIME_WINDOWS = [
  "08:00 — 10:00",
  "10:00 — 12:00",
  "12:00 — 14:00",
  "14:00 — 16:00",
  "16:00 — 18:00",
  "18:00 — 20:00",
] as const;

/** Kigali delivery zones and their fees, in RWF. */
export const DELIVERY_ZONES = [
  {
    id: "CENTRAL",
    name: "City Centre",
    areas: "Nyarugenge, Kiyovu, Muhima, Kacyiru",
    feeRwf: 2000,
  },
  {
    id: "MID",
    name: "Inner Suburbs",
    areas: "Remera, Kimihurura, Gisozi, Kibagabaga, Gacuriro",
    feeRwf: 3000,
  },
  {
    id: "OUTER",
    name: "Outer Kigali",
    areas: "Kicukiro, Kanombe, Gikondo, Nyamirambo, Kagarama",
    feeRwf: 4000,
  },
] as const;

export type DeliveryZoneId = (typeof DELIVERY_ZONES)[number]["id"];

/** Orders at or above this subtotal (RWF) ship free anywhere in Kigali. */
export const FREE_DELIVERY_THRESHOLD_RWF = 50000;

export function deliveryZoneById(id: string | null | undefined) {
  return DELIVERY_ZONES.find((z) => z.id === id) ?? null;
}

export function deliveryFeeFor(zoneId: string | null | undefined, subtotalRwf: number) {
  if (subtotalRwf >= FREE_DELIVERY_THRESHOLD_RWF) return 0;
  return deliveryZoneById(zoneId)?.feeRwf ?? 0;
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${BAKERY_INFO.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mapsEmbedUrl() {
  return `https://www.google.com/maps?q=${encodeURIComponent(BAKERY_INFO.mapsQuery)}&output=embed`;
}
