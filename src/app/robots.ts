import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sweetcrust.rw";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Staff area, the personal cart, and order receipts are not for crawlers.
      disallow: ["/admin", "/cart", "/order/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
