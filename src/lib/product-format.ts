/**
 * Pure product helpers — no Prisma import, so client components can use these
 * without dragging the database client into the browser bundle.
 * `src/lib/products.ts` holds the queries and re-exports everything here.
 */

/** `imageUrls` is a comma-separated column; first entry is the card image. */
export function productImages(imageUrls: string) {
  const list = imageUrls.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length ? list : ["/images/products/placeholder.jpg"];
}

export function primaryImage(imageUrls: string) {
  return productImages(imageUrls)[0];
}

export function allergenList(allergens: string) {
  return allergens.split(",").map((s) => s.trim()).filter(Boolean);
}

export const PRODUCT_SORTS = ["featured", "price-asc", "price-desc", "name"] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export const SORT_LABELS: Record<ProductSort, string> = {
  featured: "Featured first",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name A–Z",
};
