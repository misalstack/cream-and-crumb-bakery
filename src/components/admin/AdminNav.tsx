"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/custom-cakes", label: "Custom cakes" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-paper-50/10" aria-label="Admin sections">
      <Container className="flex gap-1 overflow-x-auto">
        {LINKS.map((link) => {
          // Only "/admin" needs an exact match; the rest own their subtrees.
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-gold-400 text-gold-300"
                  : "border-transparent text-paper-200/80 hover:text-paper-50",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </Container>
    </nav>
  );
}
