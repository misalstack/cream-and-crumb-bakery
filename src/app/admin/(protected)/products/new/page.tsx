import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <Link href="/admin/products" className="text-sm text-ink-700 hover:text-accent">
        ← Back to products
      </Link>
      <h1 className="mt-4 font-display text-4xl text-ink-900">Add a product</h1>

      <div className="mt-8">
        <ProductForm
          categories={categories}
          initial={{
            name: "",
            slug: "",
            categoryId: categories[0]?.id ?? "",
            description: "",
            longDescription: "",
            priceRwf: "",
            imageUrls: "",
            allergens: "",
            unit: "each",
            leadTimeHours: "0",
            sortOrder: "0",
            isFeatured: false,
            isSoldOut: false,
            isActive: true,
            variants: [],
          }}
        />
      </div>
    </>
  );
}
