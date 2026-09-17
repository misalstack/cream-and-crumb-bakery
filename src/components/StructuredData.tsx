import { BAKERY_INFO, OPENING_HOURS } from "@/lib/bakery-info";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sweetcrust.rw";

/**
 * schema.org `Bakery` markup so Google can show hours, location and contact
 * details in local results. Reads from bakery-info.ts, so swapping the real
 * details in updates the markup too.
 */
export function BakeryStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: BAKERY_INFO.name,
    slogan: BAKERY_INFO.tagline,
    url: BASE_URL,
    image: `${BASE_URL}/images/feature/hero-main.jpg`,
    telephone: BAKERY_INFO.phoneDisplay,
    email: BAKERY_INFO.email,
    priceRange: "RWF",
    servesCuisine: "Bakery, Patisserie",
    address: {
      "@type": "PostalAddress",
      streetAddress: BAKERY_INFO.address,
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    sameAs: [BAKERY_INFO.instagram, BAKERY_INFO.facebook, BAKERY_INFO.tiktok],
    openingHours: OPENING_HOURS.map((h) => `${h.days} ${h.hours}`),
  };

  return (
    <script
      type="application/ld+json"
      // Content is our own static config, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
