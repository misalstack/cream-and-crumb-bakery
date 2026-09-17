import Link from "next/link";
import { BrandMark } from "@/components/BrandLogo";
import { Container, LinkButton } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center bg-wine-950 py-24 text-paper-50">
      <Container className="text-center">
        <BrandMark className="mx-auto h-20 w-20" />
        <p className="mt-6 font-script text-2xl text-gold-300">Nothing on this shelf</p>
        <h1 className="mt-2 font-display text-5xl text-paper-50">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-paper-200">
          The page you were after has moved or never existed. The croissants, happily, are where they always
          are.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <LinkButton href="/patisseries" variant="gold">
            Patisserie Menu
          </LinkButton>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-paper-50/40 px-7 py-3.5 text-sm font-semibold text-paper-50 hover:bg-paper-50/10"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </main>
  );
}
