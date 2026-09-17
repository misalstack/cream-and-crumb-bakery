/**
 * Demo stand-in for `src/app/(site)/actions.ts`.
 *
 * Swapped in by `turbopack.resolveAlias` when DEMO_EXPORT=1 (see
 * next.config.ts). Static exports cannot run Server Actions at all — even
 * importing one fails the build — so the demo build resolves the same module
 * specifier to these plain client-safe functions instead.
 *
 * They validate nothing and save nothing; they just return the success state
 * so the client can see the confirmation UI.
 */
import type { ActionState } from "@/lib/validation";

const PAUSE_MS = 500;
const pause = () => new Promise((r) => setTimeout(r, PAUSE_MS));

export async function submitContactMessage(): Promise<ActionState> {
  await pause();
  return {
    ok: true,
    message:
      "Thank you — your message is with us. (Preview build: nothing was actually sent.)",
  };
}

export async function submitCustomCakeRequest(): Promise<ActionState> {
  await pause();
  return {
    ok: true,
    message:
      "Got it — your request is in. We will call or WhatsApp you within one working day. (Preview build: nothing was actually sent.)",
  };
}
