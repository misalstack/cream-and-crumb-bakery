import Link from "next/link";
import { BrandLockup } from "@/components/BrandLogo";
import { Container } from "@/components/ui";
import { BAKERY_INFO, OPENING_HOURS } from "@/lib/bakery-info";

const SHOP_LINKS = [
  { href: "/patisseries?category=pastries", label: "Pastries" },
  { href: "/patisseries?category=cakes", label: "Celebration Cakes" },
  { href: "/patisseries?category=boxes", label: "Boxes & Combos" },
  { href: "/custom-cakes", label: "Custom Cakes" },
];

const SITE_LINKS = [
  { href: "/patisseries", label: "Patisserie Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-cream-50 text-ink-900 border-t border-ink-900/10">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLockup tone="dark" showTagline />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-900">
            Handcrafted pastries, beautiful celebration cakes, and freshly baked treats made with care for life's sweetest moments.
          </p>
          <div className="mt-5 flex gap-3">
            <SocialLink href={BAKERY_INFO.instagram} label="Instagram">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2a3.9 3.9 0 0 1-.9 1.4c-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42a3.9 3.9 0 0 1-1.4-.9 3.9 3.9 0 0 1-.9-1.4c-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8Zm0 10.6a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4Zm8.2-10.9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </SocialLink>
            <SocialLink href={BAKERY_INFO.facebook} label="Facebook">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
            </SocialLink>
            <SocialLink href={BAKERY_INFO.tiktok} label="TikTok">
              <path d="M16.6 5.8a4.8 4.8 0 0 1-1.2-3.1h-3.2v12.8a2.9 2.9 0 1 1-2.1-2.8V9.4a6.1 6.1 0 1 0 5.3 6V9.7a8 8 0 0 0 4.6 1.5V8a4.8 4.8 0 0 1-3.4-2.2Z" />
            </SocialLink>
          </div>
        </div>

        <FooterColumn title="Shop">
          {SHOP_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Visit">
          {SITE_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <div>
          <h3 className="font-display text-lg text-ink-900">Visit us</h3>
          <address className="mt-4 space-y-2 text-sm not-italic text-ink-900">
            <p>245 Maple Avenue
              Brooklyn, NY 11201
              United States</p>
            <p>
              <a href={`tel:${BAKERY_INFO.phoneDisplay.replace(/\s/g, "")}`} className="hover:text-gold-300">
                +1 (718) 555-0146
              </a>
            </p>
            <p>
              <a href={`mailto:${BAKERY_INFO.email}`} className="hover:text-gold-300">
                hello@cremeandcrumb.com
              </a>
            </p>
          </address>
          <dl className="mt-5 space-y-1.5 text-sm text-ink-900">
            {OPENING_HOURS.map((h) => (
              <div key={h.days} className="flex justify-between gap-4">
                <dt>{h.days}</dt>
                <dd className="whitespace-nowrap text-ink-900">{h.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      <div className="border-t border-paper-50/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink-900 sm:flex-row">
          <p>© {new Date().getFullYear()} Crème & Crumb. All rights reserved.</p>
          <p>{BAKERY_INFO.tagline}</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg text-ink-900">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-ink-900 transition-colors hover:text-gold-300">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-50/20 text-ink-900 transition-colors hover:border-gold-400 hover:text-gold-300"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        {children}
      </svg>
    </a>
  );
}
