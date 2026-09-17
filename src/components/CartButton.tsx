"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export function CartButton() {
  const { itemCount, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={hydrated ? `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Cart"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-current/10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L21 8H6" />
        <circle cx="10" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      {/* Rendered only after hydration — the server has no way to know the
          localStorage cart, so painting a count during SSR would mismatch. */}
      {hydrated && itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[11px] font-bold text-wine-950">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
