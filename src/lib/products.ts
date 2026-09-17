import { prisma } from "@/lib/prisma";
import type { ProductSort } from "@/lib/product-format";
import type { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; variants: true };
}>;

// The pure helpers live in product-format.ts so client components can import
// them without pulling Prisma in; re-exported here so callers see one module.
export {
  productImages,
  primaryImage,
  allergenList,
  PRODUCT_SORTS,
  SORT_LABELS,
  type ProductSort,
} from "@/lib/product-format";

/** Lowest price a product can be bought at — variants can undercut the base. */
export function startingPriceRwf(product: ProductWithRelations) {
  if (!product.variants.length) return product.priceRwf;
  return Math.min(product.priceRwf, ...product.variants.map((v) => v.priceRwf));
}

export function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProducts({
  categorySlug,
  search,
  sort = "featured",
}: {
  categorySlug?: string;
  search?: string;
  sort?: ProductSort;
} = {}) {
  const where: Prisma.ProductWhereInput = { isActive: true };
  if (categorySlug) where.category = { slug: categorySlug };
  if (search?.trim()) {
    const q = search.trim();
    // SQLite's LIKE is already case-insensitive for ASCII, so no `mode` here —
    // passing `mode: "insensitive"` would throw on this provider.
    where.OR = [{ name: { contains: q } }, { description: { contains: q } }];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    sort === "price-asc"
      ? [{ priceRwf: "asc" }]
      : sort === "price-desc"
        ? [{ priceRwf: "desc" }]
        : sort === "name"
          ? [{ name: "asc" }]
          : [{ isFeatured: "desc" }, { sortOrder: "asc" }];

  return prisma.product.findMany({
    where,
    orderBy: [...orderBy, { name: "asc" }],
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
}

export function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { sortOrder: "asc" },
    take,
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
}

export function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: excludeId } },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    take,
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
}

export function getGalleryImages() {
  return prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}
