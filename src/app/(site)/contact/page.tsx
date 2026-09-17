import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container, GoldRule } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact & Visit | Crème & Crumb",
  description:
    "Visit Crème & Crumb in Brooklyn, New York, or get in touch by phone, WhatsApp, or email. Find our opening hours, delivery information, and answers to frequently asked questions.",
};

const FAQS = [
  {
    q: "Do you offer delivery?",
    a: "Yes, we offer local delivery throughout Brooklyn and nearby areas. Delivery availability and fees depend on your location and order size. Pickup from Crème & Crumb is always available.",
  },
  {
    q: "How can I place an order?",
    a: "You can explore our treats through our menu and place your order online. For custom cakes, send us your ideas, preferred date, and design details through our custom cake form.",
  },
  {
    q: "How far in advance should I order?",
    a: "For everyday pastries, orders can be placed based on daily availability. For celebration cakes, we recommend ordering at least 3 days ahead. Custom and wedding cakes may require additional notice depending on the design.",
  },
  {
    q: "Can I place an order for an event?",
    a: "Absolutely. We create pastry boxes, celebration cakes, and custom orders for birthdays, weddings, showers, corporate gatherings, and other special occasions. Contact us with your guest count and event details for a personalised quote.",
  },
];

export default function ContactPage() {
  const address = "245 Maple Avenue, Brooklyn, NY 11201, United States";
  const phone = "+1 (718) 555-0146";
  const email = "hello@cremeandcrumb.com";

  return (
    <>
      {/* Hero Section */}
      <section className="bg-cream-100 dark:bg-wine-950 py-16 sm:py-20 transition-colors">
        <Container className="text-center">
          <p className="flourish font-script text-2xl font-bold text-gold-600 dark:text-gold-400">
            We'd Love to Hear From You
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl text-gold-600 dark:text-gold-400">
            Contact & Visit
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg text-gold-600 dark:text-gold-400">
            Have a question, planning a celebration, or simply want to say hello? Get in touch with the Crème & Crumb team.
          </p>
        </Container>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-16 sm:py-20 bg-surface dark:bg-background transition-colors">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h2 className="font-display text-3xl font-bold text-gold-600 dark:text-gold-400">
              Find Crème & Crumb
            </h2>

            <address className="mt-5 space-y-4 text-base not-italic text-gold-600 dark:text-gold-400">
              <p>{address}</p>

              <p>
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="font-medium text-gold-600 dark:text-gold-400 hover:underline"
                >
                  {phone}
                </a>
              </p>

              <p>
                <a
                  href={`mailto:${email}`}
                  className="font-medium text-gold-600 dark:text-gold-400 hover:underline"
                >
                  {email}
                </a>
              </p>
            </address>

            {/* WhatsApp */}
            <a
              href="https://wa.me/17185550146?text=Hello%20Cr%C3%A8me%20%26%20Crumb!%20I%20have%20a%20question%20about%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#0a2e1f] transition-transform hover:scale-[1.02]"
            >
              <svg
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden
                className="h-5 w-5"
              >
                <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.34.65 4.53 1.78 6.4L4 29l7.76-1.73a12.9 12.9 0 0 0 4.26.73c6.62 0 12.02-5.4 12.02-12.02C28.04 8.4 22.64 3 16.02 3Zm0 21.8c-1.4 0-2.77-.31-4-.9l-.29-.15-4.6 1.02 1.05-4.48-.18-.3a9.7 9.7 0 0 1-1.5-5.17c0-5.4 4.4-9.8 9.8-9.8 5.4 0 9.8 4.4 9.8 9.8-.02 5.4-4.42 9.98-9.82 9.98Z" />
              </svg>
              Chat with Us
            </a>

            <GoldRule className="my-9" />

            {/* Opening Hours */}
            <h2 className="font-display text-3xl font-bold text-gold-600 dark:text-gold-400">
              Opening Hours
            </h2>

            <dl className="mt-5 space-y-2.5 text-base text-gold-600 dark:text-gold-400">
              <div className="flex justify-between gap-6 border-b border-ink-900/10 dark:border-paper-50/10 pb-2.5">
                <dt>Monday – Friday</dt>
                <dd className="whitespace-nowrap font-medium text-gold-600 dark:text-gold-400">
                  7:00 AM – 7:00 PM
                </dd>
              </div>

              <div className="flex justify-between gap-6 border-b border-ink-900/10 dark:border-paper-50/10 pb-2.5">
                <dt>Saturday</dt>
                <dd className="whitespace-nowrap font-medium text-gold-600 dark:text-gold-400">
                  8:00 AM – 8:00 PM
                </dd>
              </div>

              <div className="flex justify-between gap-6 border-b border-ink-900/10 dark:border-paper-50/10 pb-2.5">
                <dt>Sunday</dt>
                <dd className="whitespace-nowrap font-medium text-gold-600 dark:text-gold-400">
                  9:00 AM – 5:00 PM
                </dd>
              </div>
            </dl>

            <GoldRule className="my-9" />

            {/* Local Delivery */}
            <h2 className="font-display text-3xl font-bold text-gold-600 dark:text-gold-400">
              Local Delivery
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-gold-600 dark:text-gold-400">
              We offer local delivery throughout Brooklyn and nearby
              neighbourhoods for cakes, pastries, and celebration orders.
              Delivery availability and pricing depend on your location and
              order size.
            </p>

            <p className="mt-4 rounded-xl bg-cream-100 dark:bg-wine-900/40 border border-ink-900/10 dark:border-paper-50/10 px-5 py-3.5 text-sm text-gold-600 dark:text-gold-400">
              <strong className="text-gold-600 dark:text-gold-400">
                Pickup is always available.
              </strong>{" "}
              For larger celebration and custom cake orders, please contact us
              in advance so we can arrange the best delivery or pickup time.
            </p>
          </div>

          {/* Right Side - Map & Form */}
          <div>
            <div className="overflow-hidden rounded-3xl border border-ink-900/10 dark:border-paper-50/10">
              <iframe
                src="https://www.google.com/maps?q=245+Maple+Avenue,+Brooklyn,+NY+11201&output=embed"
                title="Map showing Crème & Crumb in Brooklyn, New York"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
              />
            </div>

            <div className="mt-8 rounded-3xl border p-7 shadow-sm sm:p-9 ">
              <h2 className="font-display text-3xl font-bold ">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm ">
                Have a question or want to discuss a custom order? Send us a
                message and we'll be happy to help.
              </p>

              <div className="mt-7 ">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="bg-cream-100 dark:bg-wine-950 py-16 transition-colors">
        <Container>
          <div className="text-center">
            <p className="flourish font-script text-2xl font-bold text-gold-600 dark:text-gold-400">
              Good to Know
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-gold-600 dark:text-gold-400">
              Questions, Answered
            </h2>
          </div>

          <dl className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-xl font-semibold text-gold-600 dark:text-gold-400">
                  {f.q}
                </dt>

                <dd className="mt-1.5 text-sm leading-relaxed text-gold-600 dark:text-gold-400">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}