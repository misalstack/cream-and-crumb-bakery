"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createProduct, deleteProduct, updateProduct } from "@/app/admin/products/actions";
import { useFormFields } from "@/components/forms/useFormFields";
import { Button, Card, FieldError, Input, Label, Select, Textarea } from "@/components/ui";
import { EMPTY_STATE } from "@/lib/validation";

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  longDescription: string;
  priceRwf: string;
  imageUrls: string;
  allergens: string;
  unit: string;
  leadTimeHours: string;
  sortOrder: string;
  isFeatured: boolean;
  isSoldOut: boolean;
  isActive: boolean;
  variants: { name: string; priceRwf: string }[];
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: { id: string; name: string }[];
  initial: ProductFormValues;
}) {
  const isEdit = Boolean(initial.id);
  const [state, action, pending] = useActionState(isEdit ? updateProduct : createProduct, EMPTY_STATE);

  // Controlled throughout — React resets the form after the action resolves,
  // which would otherwise wipe a long product description on any validation
  // error. See useFormFields.
  const { values, set, field } = useFormFields({
    name: initial.name,
    slug: initial.slug,
    categoryId: initial.categoryId,
    description: initial.description,
    longDescription: initial.longDescription,
    priceRwf: initial.priceRwf,
    imageUrls: initial.imageUrls,
    allergens: initial.allergens,
    unit: initial.unit,
    leadTimeHours: initial.leadTimeHours,
    sortOrder: initial.sortOrder,
  });
  const [flags, setFlags] = useState({
    isFeatured: initial.isFeatured,
    isSoldOut: initial.isSoldOut,
    isActive: initial.isActive,
  });
  const [variants, setVariants] = useState(initial.variants);

  return (
    <form action={action} className="space-y-6" noValidate>
      {isEdit && <input type="hidden" name="productId" value={initial.id} />}

      {state.message && (
        <p
          role="alert"
          className={
            state.ok
              ? "rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-positive"
              : "rounded-lg bg-red-500/10 px-4 py-3 text-sm text-negative"
          }
        >
          {state.message}
        </p>
      )}

      <Card className="p-7">
        <h2 className="font-display text-2xl text-ink-900">Basics</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              {...field("name")}
              onChange={(e) => {
                set("name", e.target.value);
                // Keep the slug in step until it has been edited by hand.
                if (!isEdit) {
                  set(
                    "slug",
                    e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                  );
                }
              }}
            />
            <FieldError>{state.errors?.name}</FieldError>
          </div>
          <div>
            <Label htmlFor="slug">URL slug</Label>
            <Input id="slug" required {...field("slug")} />
            <p className="mt-1 text-xs text-ink-700">/patisseries/{values.slug || "…"}</p>
            <FieldError>{state.errors?.slug}</FieldError>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" required {...field("categoryId")}>
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <FieldError>{state.errors?.categoryId}</FieldError>
          </div>
          <div>
            <Label htmlFor="imageUrls">Image path(s)</Label>
            <Input id="imageUrls" required placeholder="/images/products/my-cake.jpg" {...field("imageUrls")} />
            <p className="mt-1 text-xs text-ink-700">
              Comma-separate for a gallery. Put files in <code>public/images/products/</code>.
            </p>
            <FieldError>{state.errors?.imageUrls}</FieldError>
          </div>
        </div>

        <div className="mt-5">
          <Label htmlFor="description">Card description</Label>
          <Input id="description" required maxLength={300} {...field("description")} />
          <p className="mt-1 text-xs text-ink-700">One line, shown on the product card.</p>
          <FieldError>{state.errors?.description}</FieldError>
        </div>

        <div className="mt-5">
          <Label htmlFor="longDescription">Full description</Label>
          <Textarea id="longDescription" rows={5} required {...field("longDescription")} />
          <FieldError>{state.errors?.longDescription}</FieldError>
        </div>
      </Card>

      <Card className="p-7">
        <h2 className="font-display text-2xl text-ink-900">Pricing & timing</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="priceRwf">Base price (RWF)</Label>
            <Input id="priceRwf" type="number" min={0} required {...field("priceRwf")} />
            <FieldError>{state.errors?.priceRwf}</FieldError>
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" placeholder="each" {...field("unit")} />
            <FieldError>{state.errors?.unit}</FieldError>
          </div>
          <div>
            <Label htmlFor="leadTimeHours">Notice needed (hours)</Label>
            <Input id="leadTimeHours" type="number" min={0} max={8760} {...field("leadTimeHours")} />
            <p className="mt-1 text-xs text-ink-700">0 = on the shelf today.</p>
            <FieldError>{state.errors?.leadTimeHours}</FieldError>
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input id="sortOrder" type="number" min={0} {...field("sortOrder")} />
            <FieldError>{state.errors?.sortOrder}</FieldError>
          </div>
        </div>

        <div className="mt-5">
          <Label htmlFor="allergens">Allergens</Label>
          <Input id="allergens" placeholder="Gluten,Dairy,Eggs" {...field("allergens")} />
          <p className="mt-1 text-xs text-ink-700">Comma-separated. Shown on the product page.</p>
          <FieldError>{state.errors?.allergens}</FieldError>
        </div>
      </Card>

      <Card className="p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-ink-900">Sizes</h2>
          <button
            type="button"
            onClick={() => setVariants((v) => [...v, { name: "", priceRwf: "" }])}
            className="rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium text-ink-700 hover:border-accent/40 hover:text-accent"
          >
            Add a size
          </button>
        </div>
        <p className="mt-1.5 text-sm text-ink-700">
          Leave empty if this is sold at one price. With sizes, customers pick before adding to the cart.
        </p>

        {variants.length > 0 && (
          <ul className="mt-5 space-y-3">
            {variants.map((variant, index) => (
              <li key={index} className="flex flex-wrap items-end gap-3">
                <div className="min-w-50 flex-1">
                  <Label htmlFor={`variantName-${index}`}>Size name</Label>
                  <Input
                    id={`variantName-${index}`}
                    name="variantName"
                    placeholder="8 inch — serves 14"
                    value={variant.name}
                    onChange={(e) =>
                      setVariants((v) =>
                        v.map((item, i) => (i === index ? { ...item, name: e.target.value } : item)),
                      )
                    }
                  />
                </div>
                <div className="w-40">
                  <Label htmlFor={`variantPrice-${index}`}>Price (RWF)</Label>
                  <Input
                    id={`variantPrice-${index}`}
                    name="variantPrice"
                    type="number"
                    min={0}
                    value={variant.priceRwf}
                    onChange={(e) =>
                      setVariants((v) =>
                        v.map((item, i) => (i === index ? { ...item, priceRwf: e.target.value } : item)),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setVariants((v) => v.filter((_, i) => i !== index))}
                  className="pb-2.5 text-sm text-ink-700 underline underline-offset-4 hover:text-negative"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-7">
        <h2 className="font-display text-2xl text-ink-900">Visibility</h2>
        <div className="mt-5 space-y-3.5">
          <Toggle
            name="isActive"
            checked={flags.isActive}
            onChange={(v) => setFlags((f) => ({ ...f, isActive: v }))}
            label="Visible on the website"
            hint="Turn off to take it off the menu without deleting it."
          />
          <Toggle
            name="isSoldOut"
            checked={flags.isSoldOut}
            onChange={(v) => setFlags((f) => ({ ...f, isSoldOut: v }))}
            label="Sold out today"
            hint="Still listed, but cannot be added to a cart."
          />
          <Toggle
            name="isFeatured"
            checked={flags.isFeatured}
            onChange={(v) => setFlags((f) => ({ ...f, isFeatured: v }))}
            label="Feature on the home page"
            hint="Shows in “What Kigali keeps coming back for”."
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </Button>
          <Link
            href="/admin/products"
            className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-ink-700 hover:text-accent"
          >
            Cancel
          </Link>
        </div>

        {isEdit && (
          <button
            type="submit"
            formAction={deleteProduct}
            formNoValidate
            className="text-sm text-ink-700 underline underline-offset-4 hover:text-negative"
          >
            Retire this product
          </button>
        )}
      </div>
    </form>
  );
}

function Toggle({
  name,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-wine-800"
      />
      <span>
        <span className="block text-sm font-medium text-ink-900">{label}</span>
        <span className="block text-xs text-ink-700">{hint}</span>
      </span>
    </label>
  );
}
