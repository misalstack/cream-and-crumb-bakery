import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import { CATALOG, GALLERY_EXTRAS } from './catalog';

// Load .env manually so env vars are available regardless of how tsx is invoked
const envPath = resolve(process.cwd(), '.env');
try {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* rely on process.env already set */ }

function makePrisma() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  if (!url) throw new Error('DATABASE_URL is not set — check your .env file');
  // Prisma 7: pass config object, not pre-created client
  const adapter = new PrismaLibSql(authToken ? { url, authToken } : { url });
  return new PrismaClient({ adapter });
}

const prisma = makePrisma();

// Dev credentials only. The real bakery's owner account must be created with a
// proper password before launch — see the README checklist.
const OWNER_EMAIL = process.env.SEED_OWNER_EMAIL ?? "owner@sweetcrust.rw";
const OWNER_PASSWORD = process.env.SEED_OWNER_PASSWORD ?? "sweetcrust123";

/** Product photos worth showing in the gallery alongside the atmosphere shots. */
const GALLERY_FROM_PRODUCTS: { slug: string; caption: string; tag: string }[] = [
  { slug: "butter-croissant", caption: "Laminated over three days", tag: "pastries" },
  { slug: "cinnamon-roll", caption: "Our signature cinnamon roll", tag: "pastries" },
  { slug: "pain-au-chocolat", caption: "Two batons of dark chocolate", tag: "pastries" },
  { slug: "chicken-pie", caption: "Chicken pies, out at eleven", tag: "pastries" },
  { slug: "chocolate-chip-cookie", caption: "Chunks, never chips", tag: "pastries" },
  { slug: "wedding-cake", caption: "A wedding cake we were trusted with", tag: "cakes" },
  { slug: "red-velvet-cake", caption: "Red velvet, cut to order", tag: "cakes" },
  { slug: "drip-cake", caption: "Ganache poured warm over a chilled cake", tag: "cakes" },
  { slug: "luxury-floral-cake", caption: "Flowers arranged the morning it goes out", tag: "cakes" },
  { slug: "classic-birthday-cake", caption: "Piped by hand, name and all", tag: "cakes" },
];

async function main() {
  console.log("Seeding Sweet Crust…");

  // Staff ------------------------------------------------------------------
  await prisma.staffUser.upsert({
    where: { email: OWNER_EMAIL },
    update: {},
    create: {
      name: "Sweet Crust Owner",
      email: OWNER_EMAIL,
      passwordHash: await bcrypt.hash(OWNER_PASSWORD, 10),
      role: "OWNER",
    },
  });
  console.log(`  staff: ${OWNER_EMAIL}`);

  // Categories and products ------------------------------------------------
  let productCount = 0;

  for (const [categoryIndex, seedCategory] of CATALOG.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: seedCategory.slug },
      update: {
        name: seedCategory.name,
        description: seedCategory.description,
        imageUrl: `/images/categories/${seedCategory.slug}.jpg`,
        sortOrder: categoryIndex,
      },
      create: {
        slug: seedCategory.slug,
        name: seedCategory.name,
        description: seedCategory.description,
        imageUrl: `/images/categories/${seedCategory.slug}.jpg`,
        sortOrder: categoryIndex,
      },
    });

    for (const [productIndex, p] of seedCategory.products.entries()) {
      const data = {
        name: p.name,
        description: p.description,
        longDescription: p.longDescription,
        priceRwf: p.priceRwf,
        imageUrls: `/images/products/${p.slug}.jpg`,
        allergens: p.allergens,
        unit: p.unit,
        leadTimeHours: p.leadTimeHours ?? 0,
        isFeatured: p.isFeatured ?? false,
        isSoldOut: p.isSoldOut ?? false,
        isActive: true,
        sortOrder: productIndex,
        categoryId: category.id,
      };

      const product = await prisma.product.upsert({
        where: { slug: p.slug },
        update: data,
        create: { slug: p.slug, ...data },
      });

      // Replace variants wholesale — simpler and safer than diffing, and the
      // seed is the source of truth for them.
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });
      if (p.variants?.length) {
        await prisma.productVariant.createMany({
          data: p.variants.map((v, i) => ({
            productId: product.id,
            name: v.name,
            priceRwf: v.priceRwf,
            sortOrder: i,
          })),
        });
      }

      productCount++;
    }
  }
  console.log(`  categories: ${CATALOG.length}, products: ${productCount}`);

  // catalog.ts is the source of truth: anything not in it is removed, or the
  // fictional pre-launch range lingers alongside the client's real menu.
  // Order history survives — OrderItem keeps a name/price snapshot and its
  // productId is set to null (see the schema's onDelete: SetNull).
  //
  // ⚠️ This means re-seeding DELETES products added through /admin/products.
  // Add them to catalog.ts as well if they should be permanent.
  const catalogSlugs = CATALOG.flatMap((c) => c.products.map((p) => p.slug));
  const stale = await prisma.product.findMany({
    where: { slug: { notIn: catalogSlugs } },
    select: { id: true, name: true },
  });
  if (stale.length) {
    await prisma.productVariant.deleteMany({ where: { productId: { in: stale.map((p) => p.id) } } });
    await prisma.product.deleteMany({ where: { id: { in: stale.map((p) => p.id) } } });
    console.log(`  removed ${stale.length} products not in the catalogue: ${stale.map((p) => p.name).join(", ")}`);
  }

  // Same for categories, once their products are gone.
  const catalogCategorySlugs = CATALOG.map((c) => c.slug);
  const staleCategories = await prisma.category.findMany({
    where: { slug: { notIn: catalogCategorySlugs }, products: { none: {} } },
    select: { id: true, name: true },
  });
  if (staleCategories.length) {
    await prisma.category.deleteMany({ where: { id: { in: staleCategories.map((c) => c.id) } } });
    console.log(`  removed ${staleCategories.length} empty categories: ${staleCategories.map((c) => c.name).join(", ")}`);
  }

  // Gallery ----------------------------------------------------------------
  const galleryRows = [
    ...GALLERY_EXTRAS.map((g, i) => ({
      imageUrl: `/images/gallery/${g.slug}.jpg`,
      caption: g.caption,
      tag: g.tag,
      sortOrder: i,
    })),
    ...GALLERY_FROM_PRODUCTS.map((g, i) => ({
      imageUrl: `/images/products/${g.slug}.jpg`,
      caption: g.caption,
      tag: g.tag,
      sortOrder: GALLERY_EXTRAS.length + i,
    })),
  ];

  await prisma.galleryImage.deleteMany();
  await prisma.galleryImage.createMany({ data: galleryRows });
  console.log(`  gallery images: ${galleryRows.length}`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
