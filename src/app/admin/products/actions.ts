"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";
import { ActionState, Validator } from "@/lib/validation";

/**
 * Reads every editable Product field from the form.
 *
 * Create and update BOTH go through this one function on purpose: on a sister
 * project a new column was added to the create path only, so the field
 * silently vanished on every edit. One shared parser makes that impossible.
 */
function parseProductForm(formData: FormData) {
  const v = new Validator(formData);

  const name = v.required("name", "Name", { max: 160 });
  const slug = v
    .required("slug", "Slug", { max: 160 })
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const categoryId = v.required("categoryId", "Category", { max: 60 });
  const description = v.required("description", "Card description", { max: 300 });
  const longDescription = v.required("longDescription", "Full description", { max: 4000 });
  const priceRwf = v.integer("priceRwf", "Price", { required: true, min: 0, max: 100_000_000 }) ?? 0;
  const imageUrls = v.required("imageUrls", "Image path", { max: 1000 });
  const allergens = v.optional("allergens", "Allergens", { max: 300 }) ?? "";
  const unit = v.optional("unit", "Unit", { max: 60 }) ?? "each";
  const leadTimeHours = v.integer("leadTimeHours", "Lead time", { min: 0, max: 8760 }) ?? 0;
  const sortOrder = v.integer("sortOrder", "Sort order", { min: 0, max: 9999 }) ?? 0;

  if (!slug && !v.errors.slug) v.errors.slug = "Slug must contain letters or numbers.";

  return {
    v,
    data: {
      name,
      slug,
      categoryId,
      description,
      longDescription,
      priceRwf,
      imageUrls,
      allergens,
      unit,
      leadTimeHours,
      sortOrder,
      isFeatured: formData.get("isFeatured") === "on",
      isSoldOut: formData.get("isSoldOut") === "on",
      isActive: formData.get("isActive") === "on",
    },
  };
}

/** Variants arrive as parallel arrays from repeated inputs. */
function parseVariants(formData: FormData) {
  const names = formData.getAll("variantName").map(String);
  const prices = formData.getAll("variantPrice").map(String);

  return names
    .map((name, i) => ({ name: name.trim(), priceRwf: Number(prices[i]), sortOrder: i }))
    .filter((variant) => variant.name.length > 0 && Number.isInteger(variant.priceRwf) && variant.priceRwf >= 0);
}

export async function createProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const { v, data } = parseProductForm(formData);

  if (!v.hasErrors && (await prisma.product.findUnique({ where: { slug: data.slug } }))) {
    v.errors.slug = "Another product already uses that slug.";
  }
  if (v.hasErrors) return { ok: false, errors: v.errors, message: "Please check the highlighted fields." };

  const product = await prisma.product.create({
    data: { ...data, variants: { create: parseVariants(formData) } },
  });

  revalidatePath("/admin/products");
  revalidatePath("/patisseries");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const id = String(formData.get("productId") ?? "");
  if (!id) return { ok: false, message: "Missing product." };

  const { v, data } = parseProductForm(formData);

  const clash = !v.hasErrors && (await prisma.product.findUnique({ where: { slug: data.slug } }));
  if (clash && clash.id !== id) v.errors.slug = "Another product already uses that slug.";
  if (v.hasErrors) return { ok: false, errors: v.errors, message: "Please check the highlighted fields." };

  await prisma.product.update({ where: { id }, data });

  // Variants are replaced wholesale — the form always posts the full set.
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  const variants = parseVariants(formData);
  if (variants.length) {
    await prisma.productVariant.createMany({ data: variants.map((variant) => ({ ...variant, productId: id })) });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/patisseries");
  return { ok: true, message: "Saved." };
}

/** Quick toggles from the product list, without opening the editor. */
export async function toggleProductFlag(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("productId") ?? "");
  const flag = String(formData.get("flag") ?? "");
  if (!id || !["isFeatured", "isSoldOut", "isActive"].includes(flag)) return;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { [flag]: !product[flag as "isFeatured" | "isSoldOut" | "isActive"] },
  });

  revalidatePath("/admin/products");
  revalidatePath("/patisseries");
}

export async function deleteProduct(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("productId") ?? "");
  if (!id) return;

  // Past orders reference products, so retire rather than destroy: an order
  // from last month must still show what was actually bought.
  await prisma.product.update({ where: { id }, data: { isActive: false } });

  revalidatePath("/admin/products");
  revalidatePath("/patisseries");
  redirect("/admin/products");
}
