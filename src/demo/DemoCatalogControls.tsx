"use client";

import { useEffect, useRef, useState } from "react";
import { Select } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PRODUCT_SORTS, SORT_LABELS, type ProductSort } from "@/lib/product-format";

/**
 * Category / search / sort for the static demo.
 *
 * The live site does this on the server through `searchParams`, which a static
 * export cannot read — there is no request. So the demo renders every product
 * once and this filters the already-rendered cards in the browser, matching on
 * the `data-*` attributes the page puts on each grid cell and reordering with
 * CSS `order`. Same controls, same result, no server.
 */
export type DemoCatalogItem = {
  category: string;
  name: string;
  blurb: string;
  price: number;
  featured: boolean;
  sort: number;
};

export function DemoCatalogControls({
  categories,
  items,
  gridId,
}: {
  categories: { slug: string; name: string }[];
  /** Same order as the rendered grid cells — matched to them by index. */
  items: DemoCatalogItem[];
  gridId: string;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ProductSort>("featured");
  const searchRef = useRef<HTMLInputElement>(null);

  // Worked out during render from props, not from the DOM, so the visible
  // count needs no state and the effect only has to paint the result.
  const needle = query.trim().toLowerCase();
  const matching = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const inCategory = !category || item.category === category;
      const hit = !needle || item.name.includes(needle) || item.blurb.includes(needle);
      return inCategory && hit;
    });

  const ordered = [...matching].sort((a, b) => {
    if (sort === "price-asc") return a.item.price - b.item.price;
    if (sort === "price-desc") return b.item.price - a.item.price;
    if (sort === "name") return a.item.name.localeCompare(b.item.name);
    return Number(b.item.featured) - Number(a.item.featured) || a.item.sort - b.item.sort;
  });

  const visible = matching.length;
  const orderKey = ordered.map((o) => o.index).join(",");

  useEffect(() => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const cells = [...grid.children] as HTMLElement[];
    const shown = new Set(orderKey ? orderKey.split(",").map(Number) : []);

    cells.forEach((cell, i) => {
      cell.hidden = !shown.has(i);
    });
    [...shown].forEach((cellIndex, position) => {
      const cell = cells[cellIndex];
      if (cell) cell.style.order = String(position);
    });
  }, [orderKey, gridId]);

  return (
    <>
      <nav aria-label="Product categories" className="flex flex-wrap gap-2.5">
        <Pill active={category === null} onClick={() => setCategory(null)}>
          All
        </Pill>
        {categories.map((c) => (
          <Pill key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>
            {c.name}
          </Pill>
        ))}
      </nav>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(searchRef.current?.value ?? "");
          }}
          className="flex w-full max-w-sm items-center gap-2"
        >
          <label htmlFor="demo-search" className="sr-only">
            Search the patisserie
          </label>
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/60"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="demo-search"
              ref={searchRef}
              type="search"
              defaultValue=""
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search croissant, chicken pie, red velvet…"
              className="w-full rounded-full border border-ink-900/15 bg-surface py-2.5 pl-9 pr-4 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-700/50 focus:border-accent focus:ring-1 focus:ring-accent"
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
            {visible} {visible === 1 ? "item" : "items"}
          </span>
          <label htmlFor="demo-sort" className="sr-only">
            Sort products
          </label>
          <Select
            id="demo-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as ProductSort)}
            className="w-auto rounded-full py-2.5"
          >
            {PRODUCT_SORTS.map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-wine-800 bg-wine-800 text-paper-50"
          : "border-ink-900/15 text-ink-700 hover:border-accent/40 hover:text-accent",
      )}
    >
      {children}
    </button>
  );
}
