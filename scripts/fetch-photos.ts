/**
 * Downloads placeholder photography into `public/images/`.
 *
 * These are stand-ins so the site can be reviewed with real-looking food on
 * it. Every one is meant to be replaced by Sweet Crust's own photography —
 * drop the client's file over the same path and nothing else changes.
 *
 * Sources are openly-licensed and filtered to commercial-use licences:
 *   1. Openverse (https://api.openverse.org) — primary
 *   2. Wikimedia Commons — fallback when Openverse rate-limits or has nothing
 *
 * Attribution for every file is written to `public/images/CREDITS.md`.
 *
 * Usage:
 *   npx tsx scripts/fetch-photos.ts                  # fill in anything missing
 *   npx tsx scripts/fetch-photos.ts --force          # re-fetch everything
 *   npx tsx scripts/fetch-photos.ts --only=lemon-tart,palmier --pick=2
 *     ^ re-fetch just those slugs, taking the 3rd candidate instead of the 1st
 *       (how you replace a photo that looked wrong on the contact sheet)
 */

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import path from "node:path";
import { CATALOG, FEATURE_IMAGES, GALLERY_EXTRAS } from "../prisma/catalog";

const PUBLIC_IMAGES = path.join(process.cwd(), "public", "images");
const CREDITS_PATH = path.join(PUBLIC_IMAGES, "CREDITS.md");
const MIN_BYTES = 25_000;

type Job = { dir: string; slug: string; query: string; keywords: string[] };
type Credit = {
  file: string;
  title: string;
  creator: string;
  license: string;
  source: string;
  provider: string;
};

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").map((s) => s.trim())) : null;
const pickArg = args.find((a) => a.startsWith("--pick="));
const pick = pickArg ? Number(pickArg.slice("--pick=".length)) : 0;

// Words that carry no signal when scoring how well a result matches a query.
const STOPWORDS = new Set([
  "the", "a", "of", "and", "with", "on", "in", "to", "topped", "fresh", "free",
  "sliced", "slice", "whole", "each", "box", "per", "table", "white",
]);

function keywordsFor(query: string) {
  return [...new Set(query.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2 && !STOPWORDS.has(w)))];
}

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  const push = (dir: string, slug: string, query: string) =>
    jobs.push({ dir, slug, query, keywords: keywordsFor(query) });

  for (const category of CATALOG) {
    push("categories", category.slug, category.photoQuery);
    for (const product of category.products) push("products", product.slug, product.photoQuery);
  }
  for (const g of GALLERY_EXTRAS) push("gallery", g.slug, g.photoQuery);
  for (const f of FEATURE_IMAGES) push("feature", f.slug, f.photoQuery);
  return jobs;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * How well a candidate matches what we asked for. Without this the APIs
 * cheerfully hand back a wedding cake for "chocolate fudge cake" or a 19th
 * century book scan for "baker working in bakery".
 */
function relevance(candidate: Candidate, keywords: string[]) {
  const haystack = `${candidate.title} ${candidate.tags.join(" ")}`.toLowerCase();
  return keywords.reduce((score, kw) => (haystack.includes(kw) ? score + 1 : score), 0);
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

type Candidate = {
  url: string;
  title: string;
  creator: string;
  license: string;
  source: string;
  provider: string;
  tags: string[];
};

async function searchOpenverse(query: string): Promise<Candidate[]> {
  const url =
    "https://api.openverse.org/v1/images/?" +
    new URLSearchParams({
      q: query,
      license_type: "commercial",
      mature: "false",
      page_size: "20",
    });

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`openverse ${res.status}`);
  const json = (await res.json()) as {
    results?: {
      url?: string;
      title?: string;
      creator?: string;
      license?: string;
      license_version?: string;
      foreign_landing_url?: string;
      width?: number;
      tags?: { name?: string }[];
    }[];
  };

  return (json.results ?? [])
    .filter((r) => r.url && (r.width ?? 0) >= 900)
    .map((r) => ({
      url: r.url!,
      title: r.title?.trim() || query,
      creator: r.creator?.trim() || "Unknown",
      license: `CC ${(r.license ?? "").toUpperCase()} ${r.license_version ?? ""}`.trim(),
      source: r.foreign_landing_url ?? r.url!,
      provider: "Openverse",
      tags: (r.tags ?? []).map((t) => t.name ?? "").filter(Boolean),
    }));
}

// Commons rate-limits anonymous callers hard; keep our own spacing and back off
// once on 429 rather than burning the rest of the run.
let lastCommonsCall = 0;
async function commonsFetch(url: string, attempt = 0): Promise<Response> {
  const wait = Math.max(0, 1200 - (Date.now() - lastCommonsCall));
  if (wait) await sleep(wait);
  lastCommonsCall = Date.now();
  const res = await fetch(url, {
    headers: { "User-Agent": "SweetCrustSiteBuild/1.0 (placeholder photo fetch; contact: hello@sweetcrust.rw)" },
  });
  if (res.status === 429 && attempt < 2) {
    await sleep(4000 * (attempt + 1));
    return commonsFetch(url, attempt + 1);
  }
  return res;
}

async function searchCommons(query: string): Promise<Candidate[]> {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: "6",
      gsrlimit: "20",
      prop: "imageinfo",
      iiprop: "url|extmetadata|size",
      iiurlwidth: "1400",
      format: "json",
    });

  const res = await commonsFetch(url);
  if (!res.ok) throw new Error(`commons ${res.status}`);
  const json = (await res.json()) as {
    query?: {
      pages?: Record<
        string,
        {
          title?: string;
          imageinfo?: {
            thumburl?: string;
            descriptionurl?: string;
            width?: number;
            extmetadata?: Record<string, { value?: string }>;
          }[];
        }
      >;
    };
  };

  const pages = Object.values(json.query?.pages ?? {});
  return pages
    .map((p) => {
      const info = p.imageinfo?.[0];
      if (!info?.thumburl) return null;
      // Only bitmap photos — drop diagrams and SVG-ish renders that slip through.
      if (!/\.(jpe?g|png)$/i.test(p.title ?? "")) return null;
      const meta = info.extmetadata ?? {};
      const stripHtml = (s?: string) => (s ?? "").replace(/<[^>]*>/g, "").trim();
      const title = stripHtml(p.title?.replace(/^File:/, "").replace(/\.(jpe?g|png)$/i, "")) || query;
      return {
        url: info.thumburl,
        title,
        creator: stripHtml(meta.Artist?.value) || "Unknown",
        license: stripHtml(meta.LicenseShortName?.value) || "See source",
        source: info.descriptionurl ?? info.thumburl,
        provider: "Wikimedia Commons",
        tags: [stripHtml(meta.ImageDescription?.value)].filter(Boolean),
      };
    })
    .filter((c): c is Candidate => c !== null);
}

async function tryDownload(candidate: Candidate, dest: string): Promise<boolean> {
  try {
    const res = await fetch(candidate.url, {
      headers: { "User-Agent": "SweetCrustSiteBuild/1.0" },
    });
    if (!res.ok) return false;
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < MIN_BYTES) return false;
    await writeFile(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function loadExistingCredits(): Promise<Map<string, Credit>> {
  const map = new Map<string, Credit>();
  try {
    const raw = await readFile(CREDITS_PATH + ".json", "utf8");
    for (const c of JSON.parse(raw) as Credit[]) map.set(c.file, c);
  } catch {
    // First run — no credits yet.
  }
  return map;
}

async function writeCredits(credits: Map<string, Credit>) {
  const list = [...credits.values()].sort((a, b) => a.file.localeCompare(b.file));
  await writeFile(CREDITS_PATH + ".json", JSON.stringify(list, null, 2));

  const lines = [
    "# Placeholder photo credits",
    "",
    "Every image in this folder is a **placeholder** pending Sweet Crust's own",
    "photography. Each was fetched from an openly-licensed source filtered to",
    "commercial-use licences. Replace a file in place (same path, same name) and",
    "the site picks it up with no code change.",
    "",
    "Regenerate with `npx tsx scripts/fetch-photos.ts`.",
    "",
    "| File | Title | Creator | Licence | Source |",
    "| --- | --- | --- | --- | --- |",
    ...list.map(
      (c) =>
        `| \`${c.file}\` | ${c.title.replace(/\|/g, "/")} | ${c.creator.replace(/\|/g, "/")} | ${c.license} | [${c.provider}](${c.source}) |`,
    ),
    "",
  ];
  await writeFile(CREDITS_PATH, lines.join("\n"));
}

async function main() {
  const jobs = buildJobs().filter((j) => !only || only.has(j.slug));
  const credits = await loadExistingCredits();

  for (const dir of ["categories", "products", "gallery", "feature"]) {
    await mkdir(path.join(PUBLIC_IMAGES, dir), { recursive: true });
  }

  let downloaded = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const job of jobs) {
    const rel = `${job.dir}/${job.slug}.jpg`;
    const dest = path.join(PUBLIC_IMAGES, job.dir, `${job.slug}.jpg`);

    if (!force && !only && (await exists(dest))) {
      skipped++;
      continue;
    }

    // Pull from both sources, then rank them together — Commons often has the
    // better match for the traditional European pastries, Openverse for the
    // styled food photography.
    let candidates: Candidate[] = [];
    for (const [name, search] of [
      ["openverse", searchOpenverse],
      ["commons", searchCommons],
    ] as const) {
      try {
        candidates = candidates.concat(await search(job.query));
      } catch (err) {
        console.warn(`  ${name} failed for "${job.query}": ${(err as Error).message}`);
      }
    }

    const ranked = candidates
      .map((c) => ({ c, score: relevance(c, job.keywords) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    let ok = false;
    for (const { c, score } of ranked.slice(pick)) {
      if (await tryDownload(c, dest)) {
        credits.set(rel, { file: rel, ...c, source: c.source });
        console.log(`✓ ${rel}  ←  ${c.title}  [${c.provider}, match ${score}/${job.keywords.length}]`);
        downloaded++;
        ok = true;
        break;
      }
    }
    if (!ok) {
      failed.push(rel);
      console.error(
        `✗ ${rel} — nothing relevant for "${job.query}" (${candidates.length} candidates, 0 matched)`,
      );
    }

    await sleep(350);
  }

  await writeCredits(credits);

  console.log(`\nDone. downloaded=${downloaded} skipped=${skipped} failed=${failed.length}`);
  if (failed.length) console.log("Failed:\n  " + failed.join("\n  "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
