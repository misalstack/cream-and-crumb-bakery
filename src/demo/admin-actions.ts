/**
 * Demo stand-in for `src/app/admin/actions.ts` — see site-actions.ts for why.
 *
 * The demo admin is a read-only walkthrough: any credentials get you in, and
 * the status/read toggles are rendered as disabled controls rather than
 * wired to these, so most of these are never called.
 */
import type { ActionState } from "@/lib/validation";

export async function login(): Promise<ActionState> {
  await new Promise((r) => setTimeout(r, 400));
  // Any details work in the preview; the real build checks a bcrypt hash.
  return { ok: true, redirectTo: "/admin" };
}

export async function logout(): Promise<void> {
  /* no session to clear in the preview */
}

export async function updateOrderStatus(): Promise<void> {}
export async function updateRequestStatus(): Promise<void> {}
export async function toggleMessageRead(): Promise<void> {}
