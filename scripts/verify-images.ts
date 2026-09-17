/**
 * Checks that every image path in the database actually exists in public/.
 *
 *   npx tsx scripts/verify-images.ts
 *
 * Worth running after editing the catalogue or pruning photos — a missing file
 * shows up as a broken image on the live site rather than a build error.
 */

import { PrismaClient } from "@prisma/client";
import { existsSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();
const PUBLIC_DIR = path.join(process.cwd(), "public");

async function main() {
  const missing: string[] = [];
  const seen = new Set<string>();

  const check = (label: string, url: string) => {
    seen.add(url);
    if (!existsSync(path.join(PUBLIC_DIR, url))) missing.push(`${label} → ${url}`);
  };

  for (const product of await prisma.product.findMany()) {
    for (const url of product.imageUrls.split(",").map((s) => s.trim()).filter(Boolean)) {
      check(`product ${product.slug}`, url);
    }
  }
  for (const category of await prisma.category.findMany()) {
    check(`category ${category.slug}`, category.imageUrl);
  }
  for (const image of await prisma.galleryImage.findMany()) {
    check("gallery", image.imageUrl);
  }

  console.log(`checked ${seen.size} referenced images`);
  if (missing.length) {
    console.error(`\n${missing.length} MISSING:\n  ${missing.join("\n  ")}`);
    process.exitCode = 1;
  } else {
    console.log("all present");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
