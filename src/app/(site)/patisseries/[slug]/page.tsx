import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { Badge, Container, GoldRule, SectionHeading } from "@/components/ui";
import { formatPrice } from "@/lib/currency";
import { getCurrency } from "@/lib/currency-server";
import {
  allergenList,
  getProductBySlug,
  getRelatedProducts,
  primaryImage,
  productImages,
} from "@/lib/products";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} · Sweet Crust`,
      description: product.description,
      images: [{ url: primaryImage(product.imageUrls) }],
    },
  };
}

function noticeLabel(hours: number) {
  if (hours === 0) return "On the shelf today";
  if (hours < 24) return `${hours} hours notice`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} notice`;
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [currency, related] = await Promise.all([
    getCurrency(),
    getRelatedProducts(product.categoryId, product.id, 4),
  ]);

  const images = productImages(product.imageUrls);
  const allergens = allergenList(product.allergens);
  const priceRange =
    product.variants.length > 0
      ? {
          min: Math.min(...product.variants.map((v) => v.priceRwf)),
          max: Math.max(...product.variants.map((v) => v.priceRwf)),
        }
      : null;

  return (
    <>
      <Container className="py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-700">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/patisseries" className="hover:text-accent">
                Patisseries
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/patisseries?category=${product.category.slug}`} className="hover:text-accent">
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink-900">{product.name}</li>
          </ol>
        </nav>
      </Container>

      <Container className="grid gap-12 pb-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
            <Image
              src={images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.isSoldOut && (
              <span className="absolute inset-0 flex items-center justify-center bg-wine-950/60 font-display text-2xl tracking-widest text-cream-50">
                SOLD OUT TODAY
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={src} alt="" fill sizes="12vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blush">{product.category.name}</Badge>
            {product.isFeatured && <Badge tone="gold">Bestseller</Badge>}
            <Badge tone={product.leadTimeHours === 0 ? "success" : "neutral"}>
              {noticeLabel(product.leadTimeHours)}
            </Badge>
          </div>

          <h1 className="mt-5 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">{product.name}</h1>

          <p className="mt-4 text-lg leading-relaxed text-ink-700">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-accent">
              {priceRange
                ? priceRange.min === priceRange.max
                  ? formatPrice(priceRange.min, currency)
                  : `${formatPrice(priceRange.min, currency)} – ${formatPrice(priceRange.max, currency)}`
                : formatPrice(product.priceRwf, currency)}
            </span>
            <span className="text-sm text-ink-700">{product.unit}</span>
          </div>

          <div className="mt-8">
            <AddToCart
              currency={currency}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: images[0],
                priceRwf: product.priceRwf,
                unit: product.unit,
                isSoldOut: product.isSoldOut,
                variants: product.variants.map((v) => ({ id: v.id, name: v.name, priceRwf: v.priceRwf })),
              }}
            />
          </div>

          <GoldRule className="my-9" />

          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-ink-900">About this bake</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-700">{product.longDescription}</p>
            </div>

            {allergens.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-700">Contains</h2>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {allergens.map((a) => (
                    <Badge key={a}>{a}</Badge>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-700">
                  Everything is baked in one kitchen that handles gluten, dairy, eggs, nuts and sesame, so we
                  cannot guarantee any item is free of traces. Tell us about an allergy and we will talk you
                  through it honestly.
                </p>
              </div>
            )}

            {product.leadTimeHours > 0 && (
              <p className="rounded-xl bg-cream-100 px-5 py-4 text-sm leading-relaxed text-ink-700">
                <strong className="text-ink-900">Please order ahead.</strong> This one is made to order and
                needs {noticeLabel(product.leadTimeHours).toLowerCase()}. Choose a collection or delivery date
                at checkout and we will confirm it on WhatsApp.
              </p>
            )}
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="bg-cream-100 py-20">
          <Container>
            <SectionHeading eyebrow="You might also like" title={`More ${product.category.name.toLowerCase()}`} />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} currency={currency} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
