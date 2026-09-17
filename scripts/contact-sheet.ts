/**
 * Dev-only helper: renders every downloaded placeholder photo into one grid so
 * the whole set can be eyeballed at once and bad matches spotted.
 *
 *   npx tsx scripts/contact-sheet.ts                    → all images
 *   npx tsx scripts/contact-sheet.ts --only=a,b,c       → just those slugs
 *
 * Writes `public/_contact-sheet-N.html`, one page per viewport-worth.
 *
 * Delete `public/_contact-sheet.html` before shipping — it is a review tool,
 * not part of the site.
 */

import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PUBLIC_IMAGES = path.join(process.cwd(), "public", "images");
const DIRS = ["feature", "categories", "products", "gallery"];

const PER_PAGE = 12;

const onlyArg = process.argv.slice(2).find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").map((s) => s.trim())) : null;

async function main() {
  // One flat list, then split across pages small enough that each fits in a
  // single browser viewport — screenshots here don't follow programmatic
  // scrolling, so paging beats one tall document.
  const all: { dir: string; file: string }[] = [];
  for (const dir of DIRS) {
    try {
      const files = (await readdir(path.join(PUBLIC_IMAGES, dir))).filter((f) => f.endsWith(".jpg")).sort();
      for (const file of files) {
        if (only && !only.has(file.replace(".jpg", ""))) continue;
        all.push({ dir, file });
      }
    } catch {
      continue;
    }
  }

  const pageCount = Math.ceil(all.length / PER_PAGE);

  for (let p = 0; p < pageCount; p++) {
    const slice = all.slice(p * PER_PAGE, (p + 1) * PER_PAGE);
    const cells = slice
      .map(
        ({ dir, file }) => `<figure>
        <img src="/images/${dir}/${file}" alt="${file}">
        <figcaption>${dir}/${file.replace(".jpg", "")}</figcaption>
      </figure>`,
      )
      .join("\n");

    const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Contact sheet ${p + 1}/${pageCount}</title>
<style>
  body { font: 13px system-ui, sans-serif; background:#1a0d11; color:#f7ece9; margin:0; padding:16px; }
  h1 { font-size:16px; margin:0 0 12px; }
  .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  figure { margin:0; }
  img { width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:6px; background:#333; display:block; }
  figcaption { font-size:11px; opacity:.8; margin-top:4px; word-break:break-all; }
</style></head>
<body><h1>Contact sheet ${p + 1} of ${pageCount}</h1>
<div class="grid">${cells}</div>
</body></html>`;

    await writeFile(path.join(process.cwd(), "public", `_contact-sheet-${p + 1}.html`), html);
  }

  console.log(`wrote ${pageCount} pages covering ${all.length} images`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
