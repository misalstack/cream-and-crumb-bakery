import Link from "next/link";
import { BrandLockup } from "@/components/BrandLogo";
import { CartButton } from "@/components/CartButton";
import { MobileMenu } from "@/components/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Container } from "@/components/ui";
import { getCurrency } from "@/lib/currency-server";
import { getTheme } from "@/lib/theme";

const NAV_ITEMS = [
  { href: "/patisseries", label: "Pastries" },
  { href: "/custom-cakes", label: "Custom Cakes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const [theme, currency] = await Promise.all([getTheme(), getCurrency()]);

  return (
    <header className="sticky top-0 z-40 bg-[#dacbc4] border-b border-gold-600/20 backdrop-blur-md transition-colors duration-200">
      <Container className="flex `h-[72px]` items-center justify-between gap-4">
        <Link href="/" aria-label="Crème & Crumb — home">
          <BrandLockup />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#4A352A] transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 text-gold-500">
          <div className="hidden items-center gap-2.5 lg:flex">
          </div>
          <CartButton />
          <Link
            href="/patisseries"
            className="hidden rounded-full bg-[#524037] px-5 py-2.5 text-sm font-semibold text-[#e2d2ca] transition-all hover:bg-gold-600 sm:inline-flex"
          >
            Explore Our Treats
          </Link>
          <MobileMenu theme={theme} navItems={NAV_ITEMS} currency={currency ?? "RWF"} />
        </div>
      </Container>
    </header>
  );
}