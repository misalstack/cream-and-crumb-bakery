import Image from "next/image";
import Link from "next/link";
import { toggleProductFlag } from "@/app/admin/products/actions";
import { Badge, LinkButton } from "@/components/ui";
import { formatRwf } from "@/lib/currency";
import { IS_DEMO } from "@/lib/demo";
import { prisma } from "@/lib/prisma";
import { primaryImage } from "@/lib/products";

export default async function AdminProductsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }],
        include: { variants: true },
      },
    },
  });

  const total = categories.reduce((n, c) => n + c.products.length, 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink-900">Products</h1>
          <p className="mt-1 text-sm text-ink-700">{total} products across {categories.length} categories</p>
        </div>
        <LinkButton href="/admin/products/new">Add a product</LinkButton>
      </div>

      {categories.map((category) => (
        <section key={category.id} className="mt-10">
          <h2 className="font-display text-2xl text-ink-900">{category.name}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-4xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wider text-ink-700">
                  <th className="py-3 pr-4 font-semibold">Product</th>
                  <th className="py-3 pr-4 font-semibold">Price</th>
                  <th className="py-3 pr-4 font-semibold">Notice</th>
                  <th className="py-3 pr-4 font-semibold">Flags</th>
                  <th className="py-3 font-semibold">Quick actions</th>
                </tr>
              </thead>
              <tbody>
                {category.products.map((product) => (
                  <tr key={product.id} className="border-b border-ink-900/5">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={primaryImage(product.imageUrls)}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-semibold text-accent hover:underline"
                          >
                            {product.name}
                          </Link>
                          <span className="block text-xs text-ink-700">/{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ink-900">
                      {formatRwf(product.priceRwf)}
                      <span className="block text-xs text-ink-700">
                        {product.unit}
                        {product.variants.length > 0 && ` · ${product.variants.length} sizes`}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-ink-700">
                      {product.leadTimeHours === 0 ? "Same day" : `${product.leadTimeHours}h`}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1.5">
                        {product.isFeatured && <Badge tone="gold">Featured</Badge>}
                        {product.isSoldOut && <Badge tone="danger">Sold out</Badge>}
                        {!product.isActive && <Badge tone="neutral">Hidden</Badge>}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <FlagButton productId={product.id} flag="isSoldOut">
                          {product.isSoldOut ? "Back in stock" : "Mark sold out"}
                        </FlagButton>
                        <FlagButton productId={product.id} flag="isFeatured">
                          {product.isFeatured ? "Unfeature" : "Feature"}
                        </FlagButton>
                        <FlagButton productId={product.id} flag="isActive">
                          {product.isActive ? "Hide" : "Show"}
                        </FlagButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}

function FlagButton({
  productId,
  flag,
  children,
}: {
  productId: string;
  flag: string;
  children: React.ReactNode;
}) {
  const classes =
    "rounded-full border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-accent/40 hover:text-accent";

  // Static export cannot attach a Server Action to a form, so the demo shows
  // the control disabled rather than silently doing nothing on click.
  if (IS_DEMO) {
    return (
      <button type="button" disabled title="Read-only in this preview" className={`${classes} opacity-50`}>
        {children}
      </button>
    );
  }

  return (
    <form action={toggleProductFlag}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="flag" value={flag} />
      <button type="submit" className={classes}>
        {children}
      </button>
    </form>
  );
}
