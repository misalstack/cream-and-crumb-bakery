import { cookies } from "next/headers";
import { Currency, CURRENCY_COOKIE } from "./currency";
import { IS_DEMO } from "@/lib/demo";

/** RWF is the default — USD is the opt-in view for diaspora customers. */
export async function getCurrency(): Promise<Currency> {
  // No request cookies in a static export; the demo is priced in RWF.
  if (IS_DEMO) return "RWF";
  const store = await cookies();
  return store.get(CURRENCY_COOKIE)?.value === "USD" ? "USD" : "RWF";
}
