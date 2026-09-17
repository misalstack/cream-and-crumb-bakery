/**
 * Demo stand-in for `src/app/admin/products/actions.ts` — see site-actions.ts.
 *
 * The product editor renders and validates visually, but saving is a no-op in
 * the preview build.
 */
import type { ActionState } from "@/lib/validation";

export async function createProduct(): Promise<ActionState> {
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true, message: "Preview build — the product was not saved." };
}

export async function updateProduct(): Promise<ActionState> {
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true, message: "Preview build — changes were not saved." };
}

export async function toggleProductFlag(): Promise<void> {}
export async function deleteProduct(): Promise<void> {}
