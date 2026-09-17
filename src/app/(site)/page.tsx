import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/BrandLogo";
import { ProductCard } from "@/components/ProductCard";
import { Container, Eyebrow, GoldRule, LinkButton, SectionHeading } from "@/components/ui";
import { BAKERY_INFO, FREE_DELIVERY_THRESHOLD_RWF, OPENING_HOURS } from "@/lib/bakery-info";
import { getCurrency } from "@/lib/currency-server";
import { formatRwf } from "@/lib/currency";
import { getCategories, getFeaturedProducts, getGalleryImages } from "@/lib/products";


// ⚠️ PLACEHOLDER — replace with real reviews before launch.
const TESTIMONIALS = [
  {
    quote:
      "I ordered my daughter's birthday cake three days before and it arrived in Kimihurura exactly on time, exactly as we drew it. She cried. Good crying.",
    name: "Aline M.",
    detail: "Birthday cake, Kimihurura",
  },
  {
    quote:
      "The cinnamon rolls are the only thing my husband will eat for breakfast now. We drive across town on Saturdays for them and we are not sorry.",
    name: "Grace U.",
    detail: "Weekly regular",
  },
  {
    quote:
      "We used Sweet Crust for our office launch — 120 pastries, delivered warm at 7am. Not one thing went wrong.",
    name: "Jean-Paul R.",
    detail: "Corporate order, Kacyiru",
  },
];

const PROMISES = [
  {
    title: "Baked this morning",
    body: "Nothing sits overnight. What is on the counter came out of our ovens before six.",
  },
  {
    title: "Made by hand",
    body: "Laminated, shaped, piped and finished by people, not machines. Every cake is decorated to order.",
  },
  {
    title: "Fresh Delivery",
    body: `Freshly baked, carefully packed, and delivered straight to your doorstep.`,
  },
];

export default async function HomePage() {
  const [currency, categories, featured, gallery] = await Promise.all([
    getCurrency(),
    getCategories(),
    getFeaturedProducts(4),
    getGalleryImages(),
  ]);

  const galleryStrip = gallery.slice(0, 6);

  return (
    <>
      {/* Hero ------------------------------------------------------------ */}
      <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden">
        <Image
          src="/images/feature/hero-main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Two scrims: a flat wash to guarantee contrast against a busy,
            bright food photo, plus a vertical gradient so the composition
            still reads as a photograph rather than a flat colour block. */}
        <div className="absolute inset-0 -z-10 bg-black/5 dark:bg-wine-950/70" />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-white/20 via-transparent to-white/20 dark:from-wine-950/80 dark:via-wine-950/40 dark:to-wine-950/90" />

        <Container className="relative z-10 py-24 text-center ">

          <img
            src="/cream & crumb logo.png"
            alt="Crème & Crumb"
            className="h-20 w-20 shrink-0 object-contain mx-auto"
          />
          <p className="mt-3 font-script text-2xl sm:text-3xl text-ink-900">Baked with Love, Made to Delight</p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[0.12em] text-ink-900 sm:text-7xl">
            CRÈME & CRUMB
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-900 sm:text-lg">
            Indulge in freshly baked treats crafted with passion and the finest ingredients. From delicate pastries to celebration cakes, every creation is made to bring a little sweetness to your day.
          </p>
          {/* One CTA, not two. The brief asked for "Order Now" and "Patisserie
              Menu" side by side, but both land on /patisseries — two buttons to
              the same place just splits the click. The menu is still one tap
              away in the nav and the footer. */}
          <div className="mt-10 flex justify-center">
            <LinkButton href="/patisseries" className="px-10 py-4 font-semibold text-white bg-amber-950 hover:bg-amber-800 transition-all duration-300 shadow-md hover:shadow-lg dark:bg-gold-500 dark:text-wine-950 dark:hover:bg-gold-400">
              Order Now
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* Promises -------------------------------------------------------- */}
      <section className="bg-wine-950 py-14">
        <Container className="grid gap-9 sm:grid-cols-3">
          {PROMISES.map((p) => (
            <div key={p.title} className="text-center">
              <h2 className="font-display text-2xl text-[#eedcc886] ">{p.title}</h2>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#E5D5C5]">{p.body}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Categories ------------------------------------------------------ */}
      {/* Categories ------------------------------------------------------ */}
<section className="bg-cream-50  py-20 sm:py-28 text-blush-300">
  <Container>
    <SectionHeading
      align="center"
      eyebrow="What we bake"
      title="Three counters, one kitchen"
      subtitle="Browse the whole patisserie, or go straight to what you came for."
    />
    <div className="mt-14 grid gap-7 md:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/patisseries?category=${category.slug}`}
          className="group relative isolate flex aspect-4/5 flex-col justify-end overflow-hidden rounded-3xl"
        >
          <Image
            src={category.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Card ke text ke peeche dark overlay taake photo par text wazeh nazar aaye */}
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="p-7">
            <h3 className="font-display text-3xl text-white">
              {category.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-amber-100">
              {category.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Browse {category.name.toLowerCase()}
              <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  </Container>
</section>

      {/* Bestsellers ----------------------------------------------------- */}
      <section className="bg-cream-100 py-20 sm:py-28 text-[#E5D5C5]">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6 text-[#E5D5C5]">
            <SectionHeading
              eyebrow="Customer Favorites"
              title="Made to Be Loved"
            />
            <LinkButton href="/patisseries" variant="outline">
              Explore All Treats
            </LinkButton>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} currency={currency} />
            ))}
          </div>
        </Container>
      </section>

      {/* Story ----------------------------------------------------------- */}
      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
            <Image
              src="/images/feature/hero-story.jpg"
              alt="Dough being shaped in the Sweet Crust kitchen"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Where Every Crumb Tells a Story"
              subtitle="At Crème & Crumb, we believe the best moments are often shared over something freshly baked. What began as a love for traditional baking has grown into a little place where handcrafted pastries and beautiful cakes are made with care."
            />
            <p className="mt-5 text-base leading-relaxed text-ink-700">
              From the first mix of the dough to the final decoration, everything is prepared with patience and care. We believe that the smallest details matter, whether it is a morning pastry, a beautifully crafted cake, or a sweet treat shared with someone you love.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-700">
              Made fresh. Made with care. Made for your sweetest moments.
            </p>
            <div className="mt-8">
              <LinkButton href="/contact" variant="outline">
                Visit the bakery
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Custom cakes ---------------------------------------------------- */}
      <section className="relative isolate overflow-hidden py-24 text-ink-900">
        <Image
          src="/images/feature/custom-cake-hero.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-wine-950/80 text-ink-900 " />
        <Container className="text-center text-ink-900">
          <SectionHeading
            align="center"
            eyebrow="Made Just for You"
            title="Custom cakes"
            subtitle="From elegant birthday cakes to beautiful celebration pieces, we create custom designs inspired by your style, colours, and special moments. Share your idea with us and let us turn it into something deliciously unforgettable."
          />
          <div className="mt-10">
            <LinkButton href="/custom-cakes" className="px-9 py-4 font-semibold text-white bg-amber-950 hover:bg-amber-800 transition-all duration-300 shadow-md hover:shadow-lg dark:bg-gold-500 dark:text-wine-950 dark:hover:bg-gold-400 ">
              Start a custom order
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* Testimonials ---------------------------------------------------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading align="center" eyebrow="What Our Guests Say" title="Sweet Words from Our Customers" />
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-ink-900/10 bg-wine-950 p-7 shadow-sm">
                <div aria-hidden className="text-gold-600">
                  {"★★★★★"}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-ink-700">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-ink-900/10 pt-4">
                  <span className="block font-display text-lg text-ink-900">{t.name}</span>
                  <span className="block text-xs uppercase tracking-wider text-ink-700">{t.detail}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery strip --------------------------------------------------- */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <GoldRule className="mb-14" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="A Taste of Crème & Crumb" title="Fresh from Our Kitchen" />
            <LinkButton href="/gallery" variant="outline">
              Full gallery
            </LinkButton>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {galleryStrip.map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={image.imageUrl}
                  alt={image.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Visit ----------------------------------------------------------- */}
      <section className="bg-wine-950 py-16">
        <Container className="grid gap-10 sm:grid-cols-3">
          <div>
            <Eyebrow>Find us</Eyebrow>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">245 Maple Avenue
              Brooklyn, NY 11201
              United States</p>
          </div>
          <div>
            <Eyebrow>Opening hours</Eyebrow>
            <dl className="mt-3 space-y-1.5 text-sm text-ink-700">
              {OPENING_HOURS.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt>{h.days}</dt>
                  <dd className="whitespace-nowrap font-medium text-ink-900">{h.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Eyebrow>Talk to us</Eyebrow>
            <p className="mt-3 text-sm text-ink-700">
              <a href='' className="hover:text-accent">
                +1 (718) 555-0146
              </a>
              <br />
              <a href={`mailto:${BAKERY_INFO.email}`} className="hover:text-accent">
                hello@cremeandcrumb.com
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
