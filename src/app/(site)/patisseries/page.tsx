import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Container, EmptyState, LinkButton, SectionHeading } from "@/components/ui";
import { getCurrency } from "@/lib/currency-server";
import { cn } from "@/lib/cn";
import { IS_DEMO } from "@/lib/demo";
import { DemoCatalogControls } from "@/demo/DemoCatalogControls";
import {
  getCategories,
  getProducts,
  startingPriceRwf,
  PRODUCT_SORTS,
  type ProductSort,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Freshly Baked, Beautifully Made",
  description:
    "Explore our collection of handcrafted pastries, celebration cakes, and delightful treats. Every creation is prepared with carefully selected ingredients and a little extra love.",
};

export default async function PatisseriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  // A static export has no request, so `searchParams` cannot be read at build
  // time. The demo renders the whole catalogue once and filters in the browser.
  if (IS_DEMO) return <DemoPatisseries />;

  const params = await searchParams;
  const sort = (PRODUCT_SORTS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as ProductSort)
    : "featured";

  const [currency, categories, products] = await Promise.all([
    getCurrency(),
    getCategories(),
    getProducts({ categorySlug: params.category, search: params.q, sort }),
  ]);

  const activeCategory = categories.find((c) => c.slug === params.category) ?? null;

  function categoryHref(slug: string | null) {
    const next = new URLSearchParams();
    if (slug) next.set("category", slug);
    if (params.q) next.set("q", params.q);
    if (sort !== "featured") next.set("sort", sort);
    const qs = next.toString();
    return `/patisseries${qs ? `?${qs}` : ""}#menu`;
  }

  return (
    <>
      <section className="bg-wine-950 py-16 sm:py-20">
  <Container className="text-center">
    <SectionHeading
      align="center"
      eyebrow="Our Collection"
      title={
        activeCategory
          ? activeCategory.name
          : "Freshly Baked, Beautifully Made"
      }
      subtitle={
        activeCategory
          ? activeCategory.description
          : "Explore our collection of handcrafted pastries, celebration cakes, and delightful treats. Every creation is prepared with carefully selected ingredients and a little extra love."
      }
    />
  </Container>
</section>

      <section id="menu" className="scroll-mt-24 py-14 sm:py-20">
        <Container>
          <nav aria-label="Product categories" className="flex flex-wrap gap-2.5">
            <CategoryPill href={categoryHref(null)} active={!activeCategory}>
              All
            </CategoryPill>
            {categories.map((c) => (
              <CategoryPill key={c.id} href={categoryHref(c.slug)} active={activeCategory?.id === c.id}>
                {c.name}
              </CategoryPill>
            ))}
          </nav>

          <div className="mt-8">
            {/* useSearchParams needs a Suspense boundary during prerender. */}
            <Suspense fallback={<div className="h-11" />}>
              <ProductFilters resultCount={products.length} />
            </Suspense>
          </div>

          <div className="mt-10">
            {products.length === 0 ? (
              <EmptyState
                title="Nothing matched that"
                body={
                  params.q
                    ? `We could not find anything for “${params.q}”. Try a broader word, or browse a category.`
                    : "This category is empty at the moment."
                }
                action={
                  <LinkButton href="/patisseries" variant="outline">
                    Show everything
                  </LinkButton>
                }
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} currency={currency} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-wine-950 py-16">
        <Container className="flex flex-col items-center gap-5 text-center">
          <SectionHeading
            align="center"
            eyebrow="Not on the list?"
            title="We make custom cakes too"
            subtitle="Birthdays, weddings, graduations, office launches — tell us what you need and we will quote it."
          />
          <LinkButton href="/custom-cakes">Start a custom order</LinkButton>
        </Container>
      </section>
    </>
  );
}

/** The whole catalogue, rendered once, filtered client-side. Demo build only. */
async function DemoPatisseries() {
  const [currency, categories, products] = await Promise.all([
    getCurrency(),
    getCategories(),
    getProducts({}),
  ]);

  return (
    <>
      <section className="bg-wine-950 py-16 text-gold-600 dark:text-gold-400 sm:py-20">
        <Container className="text-center">
          <SectionHeading
            align="center"
            eyebrow="The counter"
            title="Patisserie Menu"
            subtitle="Everything we bake, in one place. Pastries are on the shelf today; celebration cakes are made to order, so check the notice period before you plan around one."
          />
        </Container>
      </section>

      <section id="menu" className="scroll-mt-24 py-14 sm:py-20">
        <Container>
          <DemoCatalogControls
            gridId="demo-grid"
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            items={products.map((p) => ({
              category: p.category.slug,
              name: p.name.toLowerCase(),
              blurb: p.description.toLowerCase(),
              price: startingPriceRwf(p),
              featured: p.isFeatured,
              sort: p.sortOrder,
            }))}
          />

          <div id="demo-grid" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                data-category={product.category.slug}
                data-name={product.name.toLowerCase()}
                data-blurb={product.description.toLowerCase()}
                data-price={startingPriceRwf(product)}
                data-featured={product.isFeatured ? 1 : 0}
                data-sort={product.sortOrder}
              >
                <ProductCard product={product} currency={currency} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream-100 py-16">
        <Container className="flex flex-col items-center gap-5 text-center">
          <SectionHeading
            align="center"
            eyebrow="Not on the list?"
            title="We make custom cakes too"
            subtitle="Birthdays, weddings, graduations, office launches — tell us what you need and we will quote it."
          />
          <LinkButton href="/custom-cakes">Start a custom order</LinkButton>
        </Container>
      </section>
    </>
  );
}

function CategoryPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-wine-800 bg-wine-800 text-paper-50"
          : "border-ink-900/15 text-ink-700 hover:border-accent/40 hover:text-accent",
      )}
    >
      {children}
    </Link>
  );
}
