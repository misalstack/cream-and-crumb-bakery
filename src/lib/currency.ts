// Pure currency helpers — no `next/headers` import, so this module is safe to
// pull into client bundles. The cookie reader lives in `currency-server.ts`.

export const CURRENCY_COOKIE = "currency";

export const CURRENCIES = ["RWF", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

// Prices are stored in RWF only (Int) and USD is derived, rather than
// dual-stored per product: with ~45 products a single rate is far less
// error-prone than 45 hand-maintained USD figures that silently drift.
// Update this one number when the rate moves materially.
export const RWF_PER_USD = 1450;

export function rwfToUsd(amountRwf: number) {
  return Math.round(amountRwf / RWF_PER_USD);
}

export function formatRwf(amount: number) {
  return new Intl.NumberFormat("en-RW", { maximumFractionDigits: 0 }).format(amount) + " RWF";
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formats an RWF-denominated amount in whichever currency the visitor picked. */
export function formatPrice(amountRwf: number, currency: Currency) {
  return currency === "USD" ? formatUsd(rwfToUsd(amountRwf)) : formatRwf(amountRwf);
}