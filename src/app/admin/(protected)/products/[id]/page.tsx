import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";


export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product = null;
  let categories: Array<{ id: string; name: string }> = [];

  try {
    [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    ]);
  } catch (e) {
    // Only swallow errors at build time (static pre-render). At runtime, re-throw
    // so the error boundary catches it instead of silently showing "Not Found".
    if (process.env.NODE_ENV === 'production') throw e;
  }

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/products" className="text-sm text-ink-700 hover:text-accent">
          ← Back to products
        </Link>
        <Link
          href={`/patisseries/${product.slug}`}
          target="_blank"
          className="text-sm font-semibold text-accent hover:underline"
        >
          View on the site ↗
        </Link>
      </div>

      <h1 className="mt-4 font-display text-4xl text-ink-900">{product.name}</h1>

      <div className="mt-8">
        <ProductForm
          categories={categories}
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            categoryId: product.categoryId,
            description: product.description,
            longDescription: product.longDescription,
            priceRwf: String(product.priceRwf),
            imageUrls: product.imageUrls,
            allergens: product.allergens,
            unit: product.unit,
            leadTimeHours: String(product.leadTimeHours),
            sortOrder: String(product.sortOrder),
            isFeatured: product.isFeatured,
            isSoldOut: product.isSoldOut,
            isActive: product.isActive,
            variants: product.variants.map((v) => ({ name: v.name, priceRwf: String(v.priceRwf) })),
          }}
        />
      </div>
    </>
  );
}