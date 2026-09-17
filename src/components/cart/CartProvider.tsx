"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sweetcrust.cart.v1";

export type CartItem = {
  /** `productId` alone isn't unique — a cake can be in the cart at two sizes. */
  key: string;
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantName: string | null;
  unitPriceRwf: number;
  imageUrl: string;
  quantity: number;
};

export type NewCartItem = Omit<CartItem, "key" | "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  /** False until localStorage has been read — guards against SSR/client mismatch. */
  hydrated: boolean;
  itemCount: number;
  subtotalRwf: number;
  add: (item: NewCartItem) => void;
  /** Accepts an updater so batched +/- clicks can't drop increments. */
  setQuantity: (key: string, quantity: number | ((prev: number) => number)) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function itemKey(productId: string, variantId: string | null) {
  return variantId ? `${productId}:${variantId}` : productId;
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.key === "string" &&
    typeof v.productId === "string" &&
    typeof v.name === "string" &&
    typeof v.unitPriceRwf === "number" &&
    typeof v.quantity === "number" &&
    v.quantity > 0
  );
}

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    // Corrupt or unavailable storage (private mode) — start from an empty cart.
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read once on mount rather than in useState's initializer: the server render
  // has no localStorage, so seeding state from it would hydrate-mismatch.
  useEffect(() => {
    const restored = readStoredCart();
    /* eslint-disable react-hooks/set-state-in-effect --
       This is the sanctioned "read an external store once after hydration"
       case. The cart only exists in the browser, so there is no way to know
       it during the server render. */
    if (restored.length) setItems(restored);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota or private mode — the cart still works for this page session.
    }
  }, [items, hydrated]);

  const add = useCallback((item: NewCartItem) => {
    const key = itemKey(item.productId, item.variantId);
    const qty = Math.max(1, item.quantity ?? 1);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { ...item, key, quantity: qty }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number | ((prev: number) => number)) => {
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.key !== key) return [item];
        const next = typeof quantity === "function" ? quantity(item.quantity) : quantity;
        return next <= 0 ? [] : [{ ...item, quantity: next }];
      }),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      hydrated,
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
      subtotalRwf: items.reduce((n, i) => n + i.unitPriceRwf * i.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [items, hydrated, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
