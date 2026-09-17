"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui";
import { PRODUCT_SORTS, SORT_LABELS, type ProductSort } from "@/lib/product-format";

export function ProductFilters({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  function pushWith(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    router.push(qs ? `/patisseries?${qs}#menu` : "/patisseries#menu");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const entered = new FormData(e.currentTarget).get("q");
          pushWith({ q: (typeof entered === "string" ? entered.trim() : "") || null });
        }}
        className="flex w-full max-w-sm items-center gap-2"
      >
        <label htmlFor="product-search" className="sr-only">
          Search the patisserie
        </label>
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8178]"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="product-search"
            name="q"
            type="search"
            // Uncontrolled, re-keyed on the URL: navigating via a category
            // pill or Back resets the box without an effect syncing state.
            key={query}
            defaultValue={query}
            placeholder="Search croissant, chicken pie, red velvetâ€¦"
            className="w-full rounded-full border border-ink-900/15 bg-surface py-2.5 pl-9 pr-4 text-sm text-[#2c2420] outline-none transition-colors placeholder:text-[#8A8178] focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-wine-800 px-5 py-2.5 text-sm font-semibold text-paper-50 transition-colors hover:bg-wine-700"
        >
          Search
        </button>
      </form>

      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-700">
          {resultCount} {resultCount === 1 ? "item" : "items"}
        </span>
        <label htmlFor="product-sort" className="sr-only">
          Sort products
        </label>
        <Select
          id="product-sort"
          value={(params.get("sort") as ProductSort) ?? "featured"}
          onChange={(e) => pushWith({ sort: e.target.value === "featured" ? null : e.target.value })}
          className="w-auto rounded-full py-2.5 "
        >
          {PRODUCT_SORTS.map((s) => (
            <option key={s} value={s}>
              {SORT_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
