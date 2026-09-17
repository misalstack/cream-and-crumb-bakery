/**
 * Run with: npx tsx scripts/seed-turso.ts
 * Reads DATABASE_URL and DATABASE_AUTH_TOKEN from .env or process.env
 */

// Load .env manually BEFORE anything else so env vars are available
import { readFileSync } from 'fs';
import { resolve } from 'path';

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
    if (!process.env[key]) process.env[key] = val; // don't override existing env
  }
} catch { /* .env not found, rely on process.env */ }

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/http';
import bcrypt from 'bcryptjs';
import { CATALOG, GALLERY_EXTRAS } from '../prisma/catalog';

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) { console.error('DATABASE_URL not set'); process.exit(1); }

console.log('Connecting to:', url.substring(0, 40) + '...');

const libsql = createClient({ url, authToken: authToken ?? undefined });
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

const OWNER_EMAIL = process.env.SEED_OWNER_EMAIL ?? 'owner@sweetcrust.rw';
const OWNER_PASSWORD = process.env.SEED_OWNER_PASSWORD ?? 'sweetcrust123';

const GALLERY_FROM_PRODUCTS = [
  { slug: 'butter-croissant',     caption: 'Laminated over three days',                     tag: 'pastries' },
  { slug: 'cinnamon-roll',        caption: 'Our signature cinnamon roll',                   tag: 'pastries' },
  { slug: 'pain-au-chocolat',     caption: 'Two batons of dark chocolate',                  tag: 'pastries' },
  { slug: 'chicken-pie',          caption: 'Chicken pies, out at eleven',                   tag: 'pastries' },
  { slug: 'chocolate-chip-cookie',caption: 'Chunks, never chips',                           tag: 'pastries' },
  { slug: 'wedding-cake',         caption: 'A wedding cake we were trusted with',           tag: 'cakes'    },
  { slug: 'red-velvet-cake',      caption: 'Red velvet, cut to order',                      tag: 'cakes'    },
  { slug: 'drip-cake',            caption: 'Ganache poured warm over a chilled cake',       tag: 'cakes'    },
  { slug: 'luxury-floral-cake',   caption: 'Flowers arranged the morning it goes out',      tag: 'cakes'    },
  { slug: 'classic-birthday-cake',caption: 'Piped by hand, name and all',                   tag: 'cakes'    },
];

async function main() {
  console.log('Seeding Sweet Crust...');

  await prisma.staffUser.upsert({
    where:  { email: OWNER_EMAIL },
    update: {},
    create: {
      name:         'Sweet Crust Owner',
      email:        OWNER_EMAIL,
      passwordHash: await bcrypt.hash(OWNER_PASSWORD, 10),
      role:         'OWNER',
    },
  });
  console.log('  staff:', OWNER_EMAIL);

  let productCount = 0;
  for (const [ci, cat] of CATALOG.entries()) {
    const category = await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, description: cat.description, imageUrl: `/images/categories/${cat.slug}.jpg`, sortOrder: ci },
      create: { slug: cat.slug, name: cat.name, description: cat.description, imageUrl: `/images/categories/${cat.slug}.jpg`, sortOrder: ci },
    });
    for (const [pi, p] of cat.products.entries()) {
      const data = {
        name: p.name, description: p.description, longDescription: p.longDescription,
        priceRwf: p.priceRwf, imageUrls: `/images/products/${p.slug}.jpg`,
        allergens: p.allergens, unit: p.unit, leadTimeHours: p.leadTimeHours ?? 0,
        isFeatured: p.isFeatured ?? false, isSoldOut: p.isSoldOut ?? false,
        isActive: true, sortOrder: pi, categoryId: category.id,
      };
      const product = await prisma.product.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });
      if (p.variants?.length) {
        await prisma.productVariant.createMany({
          data: p.variants.map((v: { name: string; priceRwf: number }, i: number) => ({ productId: product.id, name: v.name, priceRwf: v.priceRwf, sortOrder: i })),
        });
      }
      productCount++;
    }
  }
  console.log(`  categories: ${CATALOG.length}, products: ${productCount}`);

  const galleryRows = [
    ...GALLERY_EXTRAS.map((g: { slug: string; caption: string; tag: string }, i: number) => ({ imageUrl: `/images/gallery/${g.slug}.jpg`,   caption: g.caption, tag: g.tag, sortOrder: i })),
    ...GALLERY_FROM_PRODUCTS.map((g, i) =>             ({ imageUrl: `/images/products/${g.slug}.jpg`, caption: g.caption, tag: g.tag, sortOrder: GALLERY_EXTRAS.length + i })),
  ];
  await prisma.galleryImage.deleteMany();
  await prisma.galleryImage.createMany({ data: galleryRows });
  console.log(`  gallery images: ${galleryRows.length}`);
  console.log('Done.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
