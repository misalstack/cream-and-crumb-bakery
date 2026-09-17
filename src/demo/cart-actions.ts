/**
 * Demo stand-in for `src/app/(site)/cart/actions.ts` — see site-actions.ts for
 * why the swap exists.
 *
 * Checkout "succeeds" and hands back the pre-rendered sample confirmation, so
 * the client can walk the whole flow: cart → checkout → order received →
 * WhatsApp handoff. No order is stored.
 */
import { DEMO_ORDER_NUMBER } from "@/lib/demo";
import type { ActionState } from "@/lib/validation";

export async function placeOrder(): Promise<ActionState> {
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, redirectTo: `/order/${DEMO_ORDER_NUMBER}` };
}
