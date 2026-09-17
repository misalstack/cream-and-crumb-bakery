/**
 * Builds the static preview and publishes it to the `gh-pages` branch.
 *
 *   npm run demo:deploy
 *
 * Steps:
 *   1. seed the catalogue + sample orders so the admin walkthrough has content
 *   2. `next build` with DEMO_EXPORT=1 → out/
 *   3. commit out/ to `gh-pages` (via a scratch worktree, so your working tree
 *      is never touched) and push
 *
 * Cross-platform on purpose — setting DEMO_EXPORT inline in an npm script
 * doesn't work on Windows without adding a dependency.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const WORKTREE = path.join(ROOT, "..", ".sweet-crust-gh-pages");
const BRANCH = "gh-pages";

// Which remote to publish to; defaults to origin.
//   node scripts/deploy-demo.mjs            → origin
//   node scripts/deploy-demo.mjs uly        → the `uly` remote
const REMOTE = process.argv[2] ?? "origin";

// `npx` is a .cmd on Windows and needs a shell; git is a real executable and
// must NOT get one — with shell:true the commit message's spaces are re-split
// into separate pathspecs and the commit fails.
const npx = (args, opts = {}) =>
  execFileSync("npx", args, { stdio: "inherit", shell: process.platform === "win32", ...opts });

const git = (args, opts = {}) => execFileSync("git", args, { stdio: "inherit", ...opts });

const gitOut = (args, opts = {}) =>
  execFileSync("git", args, { encoding: "utf8", ...opts }).trim();

// A GitHub project site lives at /<repo>, so basePath must equal the repo name
// on whichever remote we are publishing to — get it wrong and every asset 404s.
const remoteUrl = execFileSync("git", ["remote", "get-url", REMOTE], { encoding: "utf8" }).trim();
const repoName = remoteUrl.replace(/\.git$/, "").split("/").pop();
const basePath = `/${repoName}`;
console.log(`Publishing to "${REMOTE}" (${remoteUrl})\nbasePath: ${basePath}`);

console.log("\n1/3  Seeding catalogue and demo data…");
npx(["tsx", "prisma/seed.ts"]);
npx(["tsx", "prisma/seed-demo.ts"]);

console.log("\n2/3  Building static export…");
rmSync(OUT, { recursive: true, force: true });
npx(["next", "build"], { env: { ...process.env, DEMO_EXPORT: "1", DEMO_BASE_PATH: basePath } });
if (!existsSync(path.join(OUT, "index.html"))) {
  console.error("Build produced no out/index.html — aborting.");
  process.exit(1);
}

console.log("\n3/3  Publishing to gh-pages…");
rmSync(WORKTREE, { recursive: true, force: true });
try {
  git(["worktree", "prune"]);
} catch {
  // Nothing to prune.
}

const branchExists = (() => {
  try {
    gitOut(["rev-parse", "--verify", BRANCH]);
    return true;
  } catch {
    return false;
  }
})();

git(["worktree", "add", ...(branchExists ? [] : ["--orphan"]), "-B", BRANCH, WORKTREE]);

// Clear whatever the branch held, then drop the fresh build in its place.
for (const entry of readdirSync(WORKTREE)) {
  if (entry === ".git") continue;
  rmSync(path.join(WORKTREE, entry), { recursive: true, force: true });
}
cpSync(OUT, WORKTREE, { recursive: true });

// Without this, Pages runs Jekyll, which ignores any directory starting with
// an underscore — i.e. all of _next/, so every script and stylesheet 404s.
writeFileSync(path.join(WORKTREE, ".nojekyll"), "");

git(["add", "-A"], { cwd: WORKTREE });
const dirty = gitOut(["status", "--porcelain"], { cwd: WORKTREE });
if (dirty) {
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  git(["commit", "-m", `chore: publish static preview (${stamp})`], { cwd: WORKTREE });
  git(["push", "-f", REMOTE, `${BRANCH}:${BRANCH}`], { cwd: WORKTREE });
} else {
  console.log("No changes to publish.");
}

git(["worktree", "remove", "--force", WORKTREE]);

const owner = remoteUrl.replace(/\.git$/, "").split("/").slice(-2)[0];
console.log(`\nDone → https://${owner.toLowerCase()}.github.io${basePath}/`);
