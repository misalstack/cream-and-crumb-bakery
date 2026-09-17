/**
 * Reads .env, sets process.env, then dynamically imports and runs the seed.
 * Usage: node scripts/run-seed.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Parse .env file and inject into process.env BEFORE any other imports
const envFile = join(root, '.env');
const lines = readFileSync(envFile, 'utf8').split('\n');
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  process.env[key] = val;
}

console.log('DATABASE_URL set:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'MISSING');
console.log('AUTH_TOKEN set:', process.env.DATABASE_AUTH_TOKEN ? 'YES' : 'NO');

// Now run the seed using @libsql/client directly (bypass tsx/Prisma for seeding)
// We'll use the same seed logic but driven from this ESM script.
const { createClient } = await import('@libsql/client/http');
const { PrismaClient } = await import('@prisma/client');
const { PrismaLibSql } = await import('@prisma/adapter-libsql');
const bcrypt = (await import('bcryptjs')).default;
const { CATALOG, GALLERY_EXTRAS } = await import('../prisma/catalog.js');

const libsql = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

const OWNER_EMAIL = process.env.SEED_OWNER_EMAIL ?? 'owner@sweetcrust.rw';
const OWNER_PASSWORD = process.env.SEED_OWNER_PASSWORD ?? 'sweetcrust123';

const GALLERY_FROM_PRODUCTS = [
  { slug: 'butter-croissant', caption: 'Laminated over three days', tag: 'pastries' },
  { slug: 'cinnamon-roll', caption: 'Our signature cinnamon roll', tag: 'pastries' },
  { slug: 'pain-au-chocolat', caption: 'Two batons of dark chocolate', tag: 'pastries' },
  { slug: 'chicken-pie', caption: 'Chicken pies, out at eleven', tag: 'pastries' },
  { slug: 'chocolate-chip-cookie', caption: 'Chunks, never chips', tag: 'pastries' },
  { slug: 'wedding-cake', caption: 'A wedding cake we were trusted with', tag: 'cakes' },
  { slug: 'red-velvet-cake', caption: 'Red velvet, cut to order', tag: 'cakes' },
  { slug: 'drip-cake', caption: 'Ganache poured warm over a chilled cake', tag: 'cakes' },
  { slug: 'luxury-floral-cake', caption: 'Flowers arranged the morning it goes out', tag: 'cakes' },
  { slug: 'classic-birthday-cake', caption: 'Piped by hand, name and all', tag: 'cakes' },
];

async function main() {
  console.log('Seeding Sweet Crust...');

  await prisma.staffUser.upsert({
    where: { email: OWNER_EMAIL },
    update: {},
    create: {
      name: 'Sweet Crust Owner',
      email: OWNER_EMAIL,
      passwordHash: await bcrypt.hash(OWNER_PASSWORD, 10),
      role: 'OWNER',
    },
  });
  console.log(`  staff: ${OWNER_EMAIL}`);

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

  console.log('Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
