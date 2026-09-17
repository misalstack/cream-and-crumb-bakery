"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { BrandLockup } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Currency } from "@/lib/currency";
import type { Theme } from "@/lib/theme-constants";

export function MobileMenu({
  currency,
  theme,
  navItems,
}: {
  currency: Currency;
  theme: Theme | null;
  navItems: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  // Stop the page behind the overlay from scrolling while it's open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-current/20"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
          <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open &&
        createPortal(
          // Portaled to <body> because the header's `backdrop-blur` (a
          // backdrop-filter) creates a containing block for `fixed`
          // descendants per the CSS spec — left inline, this panel would
          // size itself to the header instead of the viewport.
          <div className="fixed inset-0 z-50 flex flex-col bg-wine-950 text-paper-50">
            <div className="flex items-center justify-between px-5 py-4">
              <BrandLockup tone="dark" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper-50/25"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-paper-50/10 py-4 font-display text-2xl"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between gap-3 px-5 py-5">
              <div className="flex items-center gap-3">
                <ThemeToggle theme={theme} />
                
              </div>
              <Link
                href="/patisseries"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-wine-950"
              >
                Order Now
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
