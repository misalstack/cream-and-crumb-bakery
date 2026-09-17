import type { Metadata } from "next";
import Image from "next/image";
import { CustomCakeForm } from "@/components/forms/CustomCakeForm";
import { Container, GoldRule } from "@/components/ui";
import { formatRwf } from "@/lib/currency";
import { CAKE_FLAVOURS, WEDDING_STYLES } from "@/lib/cake-options";

export const metadata: Metadata = {
  title: "Custom Cakes",
  description:
    "Custom cakes in Kigali for birthdays, graduations, weddings, dowries and office celebrations — decorated by hand. Send your idea and Sweet Crust will quote it and build it.",
};

const STEPS = [
  {
    title: "Share Your Vision",
    body: "Tell us about your celebration, preferred flavours, colours, theme, and the kind of cake you have in mind. Inspiration photos are always welcome.",
  },
  {
    title: "Create Your Design",
    body: "We turn your ideas into a thoughtful cake concept, choosing the right flavours, details, and finishing touches to match your celebration.",
  },
  {
    title: "Confirm Your Order",
    body: "Once you're happy with the design and details, we'll confirm the final price, collection or delivery time, and secure your order.",
  },
  {
    title: "We Bake & Perfect",
    body: "Our bakers carefully prepare, decorate, and finish your cake by hand so it arrives looking beautiful and ready for your special moment.",
  },
];

const FAQS = [
  {
    q: "How much notice do you need?",
    a: "Two days for a decorated celebration cake, three for photo, character or floral designs, and at least two weeks for a tiered wedding cake. If your date is sooner than that, ask anyway — sometimes we can move things around.",
  },
  {
    q: "What does a custom cake cost?",
    a: `Classic birthday cakes start at $18 for a 6-inch cake serving 8–10 people, and $28 for an 8-inch cake serving 15–20 people. Premium designs — drip, photo, character and floral — range from $35 to $52. Tiered wedding cakes start at $70 for one tier. The final price depends on the size, decoration and amount of handwork required.`,
  },
  {
    q: "Can you copy a cake I saw online?",
    a: "We can work from a reference, and we will tell you plainly if something in the photo isn't achievable — or isn't edible. What we will not do is pretend a fondant sculpture is a two-day job when it is a five-day one.",
  },
  {
    q: "Do you cater for allergies?",
    a: "We can adapt many recipes, but everything is baked in one kitchen handling gluten, dairy, eggs, nuts and sesame, so we cannot promise a trace-free cake. Tell us about the allergy and we will be honest about the risk.",
  },
];

function FlavourList({ title, flavours }: { title: string; flavours: string[] }) {
  return (
    <div>
      <h3 className="font-display text-xl text-gold-300">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-paper-200">
        {flavours.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CustomCakesPage() {
  return (
    <>
      {/* HERO SECTION - Dark Overlay Removed & Direct Inline Dark Brown Styles Added */}
      <section className="relative isolate overflow-hidden bg-cream-100 py-24 sm:py-32">
        <Image
          src="/images/feature/custom-cake-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-20"
        />
        <Container className="text-center">
          <p style={{ color: "#2A1810" }} className="flourish font-script text-2xl font-bold">
            Made Just for You
          </p>
          <h1 style={{ color: "#2A1810" }} className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Cakes Made for Your Moments
          </h1>
          <p style={{ color: "#3A2318" }} className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
            From birthdays and anniversaries to weddings and unforgettable celebrations, we create custom cakes inspired by your style, colours, and ideas. Bring us your vision, and we’ll turn it into something beautifully delicious.
          </p>
        </Container>
      </section>

      {/* STEPS SECTION */}
      <section className="py-20">
        <Container>
          <div className="text-center">
            <p style={{ color: "#2A1810" }} className="flourish font-script text-xl font-bold">How it works</p>
            <h2 style={{ color: "#2A1810" }} className="mt-2 font-display text-3xl font-bold sm:text-4xl">Four steps, no surprises</h2>
          </div>
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-800 font-display text-lg font-semibold text-paper-50">
                  {i + 1}
                </span>
                <h3 style={{ color: "#2A1810" }} className="mt-4 font-display text-2xl font-semibold">
                  {step.title}
                </h3>
                <p style={{ color: "#3A2318" }} className="mt-2 text-sm leading-relaxed">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FLAVOURS SECTION (Dark Background Section) */}
      <section className="bg-wine-950 py-20 text-gold-600 dark:text-gold-400">
        <Container>
          <div className="text-center">
            <p className="flourish font-script text-xl text-gold-400">Choose a flavour</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-paper-50 sm:text-4xl">Our flavour menu</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
            <FlavourList title="Classic Favourites" flavours={CAKE_FLAVOURS.classic} />
            <FlavourList title="Signature Flavours" flavours={CAKE_FLAVOURS.premium} />
            <FlavourList title="Celebration Favourites" flavours={CAKE_FLAVOURS.wedding} />
          </div>

          <GoldRule className="my-14" />

          <div className="text-center">
            <p className="flourish font-script text-xl text-gold-400">Wedding Cakes</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-paper-50 sm:text-4xl">Designed for Your Special Day</h2>
          </div>
          <dl className="mx-auto mt-10 max-w-2xl divide-y divide-paper-50/10">
            {WEDDING_STYLES.map((s) => (
              <div key={s.style} className="flex items-center justify-between gap-6 py-3.5">
                <dt className="text-sm text-paper-200">{s.style}</dt>
                <dd className="whitespace-nowrap font-display text-lg text-gold-300">
                  from {formatRwf(s.fromRwf)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-paper-200/70">
            Our wedding cake pricing depends on the size, flavour, design, and level of detail you choose.
            Every celebration is different, so we'll confirm your personalised quote before your order is finalised.
          </p>
        </Container>
      </section>

      {/* FORM & FAQS SECTION */}
      <section className="bg-cream-100 py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p style={{ color: "#2A1810" }} className="flourish font-script text-xl font-bold">Let's Create Together</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-gold-600 dark:text-gold-600">Tell Us About Your Cake</h2>
            <p style={{ color: "#3A2318" }} className="mt-4 text-base leading-relaxed">
              Share as many details as you'd like — your occasion, style, colours, flavours, and ideas.
              We'll use your notes to understand your vision and create a cake that feels truly yours.
            </p>
            <GoldRule className="my-8" />
            <dl className="space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt style={{ color: "#2A1810" }} className="font-display text-xl font-semibold">
                    {f.q}
                  </dt>
                  <dd style={{ color: "#3A2318" }} className="mt-1.5 text-sm leading-relaxed">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-ink-900/10 bg-amber-50 p-7 shadow-sm sm:p-9">
            <CustomCakeForm />
          </div>
        </Container>
      </section>
    </>
  );
}