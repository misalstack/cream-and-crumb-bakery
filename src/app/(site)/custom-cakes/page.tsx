import type { Metadata } from "next";
import Image from "next/image";
import { CustomCakeForm } from "@/components/forms/CustomCakeForm";
import { Container, GoldRule, SectionHeading } from "@/components/ui";
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
      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <Image
          src="/images/feature/custom-cake-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-wine-950/85" />
        <Container className="text-center">
          <SectionHeading
            align="center"
            eyebrow="Made Just for You"
            title="Cakes Made for Your Moments"
            subtitle="From birthdays and anniversaries to weddings and unforgettable celebrations, we create custom cakes inspired by your style, colours, and ideas. Bring us your vision, and we’ll turn it into something beautifully delicious."
          />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading align="center" eyebrow="How it works" title="Four steps, no surprises" />
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-800 font-display text-lg font-semibold text-paper-50">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-2xl text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Flavours and wedding styles come straight from the client's menu. */}
      <section className="bg-wine-950 py-20 text-paper-50">
        <Container>
          <SectionHeading align="center" eyebrow="Choose a flavour" title="Our flavour menu" />
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
            <FlavourList title="Classic Favourites" flavours={CAKE_FLAVOURS.classic} />
            <FlavourList title="Signature Flavours" flavours={CAKE_FLAVOURS.premium} />
            <FlavourList title="Celebration Favourites" flavours={CAKE_FLAVOURS.wedding} />
          </div>

          <GoldRule className="my-14" />

          <SectionHeading align="center" eyebrow="Wedding Cakes" title="Designed for Your Special Day" />
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

      <section className="bg-cream-100 py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Let's Create Together" title="Tell Us About Your Cake" />
            <p className="mt-4 text-base leading-relaxed text-ink-700">
              Share as many details as you'd like — your occasion, style, colours, flavours, and ideas.
              We'll use your notes to understand your vision and create a cake that feels truly yours.
            </p>
            <GoldRule className="my-8" />
            <dl className="space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="font-display text-xl text-ink-900">{f.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-700">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-ink-900/10 bg-wine-950 p-7 shadow-sm sm:p-9">
            <CustomCakeForm />
          </div>
        </Container>
      </section>
    </>
  );
}
