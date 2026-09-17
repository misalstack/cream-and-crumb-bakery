import { cn } from "@/lib/cn";

/**
 * ⚠️ PLACEHOLDER LOGO — this is a hand-drawn stand-in that echoes the client's
 * launch poster (a wine roundel holding a woman in a headwrap). It is NOT the
 * real Sweet Crust logo.
 *
 * TO SWAP IN THE REAL LOGO: drop the client's file at `public/brand/logo.svg`
 * (or `.png`) and replace the whole `<svg>` below with:
 *
 *   import Image from "next/image";
 *   <Image src="/brand/logo.svg" alt="Sweet Crust" width={96} height={96}
 *          className={cn("h-12 w-12", className)} />
 *
 * Nothing else in the codebase needs to change — every surface renders the
 * logo through this component.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Crème & Crumb"
      className={cn("h-12 w-12", className)}
    >
      <circle cx="50" cy="50" r="50" className="fill-wine-800" />
      <circle cx="50" cy="50" r="45" fill="none" strokeWidth="0.8" className="stroke-gold-400/50" />

      {/* Bust and neck */}
      <path
        d="M44 62 L44 70 C34 71 28 78 26 88 L74 88 C72 78 66 71 56 70 L56 62 Z"
        className="fill-paper-100"
      />
      {/* Face */}
      <ellipse cx="50" cy="54" rx="11.5" ry="13.5" className="fill-paper-100" />
      {/* Headwrap — a dome whose inner edge forms the hairline */}
      <path
        d="M36 52 C33 39 40 29 50 29 C61 29 68 39 65 52 C63 43 57 40 50.5 40 C44 40 38 43 36 52 Z"
        className="fill-paper-100"
      />

      <g fill="none" strokeLinecap="round" strokeWidth="1.1" className="stroke-wine-800">
        {/* Folds in the wrap */}
        <path d="M40 44 C43 36 50 33 58 34" />
        <path d="M43 38 C47 34 53 33 58 35" />
        {/* Closed eyes, nose, lips — the serene look from the poster */}
        <path d="M43 53 C44.5 55 46.5 55 48 53" />
        <path d="M52 53 C53.5 55 55.5 55 57 53" />
        <path d="M50 55.5 L50 58.5" />
        <path d="M47.5 62 C48.8 63.2 51.2 63.2 52.5 62" />
      </g>

      {/* Earrings */}
      <circle cx="38.6" cy="58" r="1.6" className="fill-gold-400" />
      <circle cx="61.4" cy="58" r="1.6" className="fill-gold-400" />
    </svg>
  );
}

/** Mark + wordmark, for the header, footer and hero. */
export function BrandLockup({
  className,
  tone = "light",
  showTagline = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  showTagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-[#e2a4ae]", className)}>
      <img
        src="/cream & crumb logo.png"
        alt="Crème & Crumb"
        className="h-15 w-18 shrink-0 object-contain"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-[0.18em]",
            tone === "dark" ? "text-ink-900" : "text-[#9A6B4F]",
          )}
        >
          CRÈME & CRUMB
        </span>
        {showTagline && (
          <span className={cn("mt-1 font-script text-base", tone === "dark" ? "text-ink-900" : "text-gold-600")}>
            Baked with Love, Made to Delight
          </span>
        )}
      </span>
    </span>
  );
}
