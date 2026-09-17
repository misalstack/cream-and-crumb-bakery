import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, GoldRule, LinkButton } from "@/components/ui";
import { BAKERY_INFO, whatsappLink } from "@/lib/bakery-info";
import { formatPrice } from "@/lib/currency";
import { getCurrency } from "@/lib/currency-server";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/enums";
import { formatDate } from "@/lib/format";
import { DEMO_ORDER, DEMO_ORDER_NUMBER, IS_DEMO } from "@/lib/demo";
import { getOrderByNumber, orderWhatsAppMessage, zoneLabel } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

// The static demo has no database, so it pre-renders one sample confirmation.
// The live build leaves this route dynamic and looks the order up for real.
export function generateStaticParams() {
  return [{ orderNumber: DEMO_ORDER_NUMBER || "demo-123" }];
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const [fetched, currency] = await Promise.all([
    IS_DEMO ? Promise.resolve(null) : getOrderByNumber(orderNumber),
    getCurrency(),
  ]);
  const order = IS_DEMO ? DEMO_ORDER : fetched;
  if (!order) notFound();

  const isDelivery = order.fulfillment === "DELIVERY";

  return (
    <Container className="max-w-3xl py-16 sm:py-24">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-positive">
          ✓
        </span>
        <h1 className="mt-6 font-display text-4xl text-ink-900 sm:text-5xl">Order received</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-700">
          Thank you, {order.customerName.split(" ")[0]}. Your order number is{" "}
          <strong className="font-semibold text-accent">{order.orderNumber}</strong> — write it down or
          screenshot this page.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-gold-400/40 bg-blush-100 p-7 text-center sm:p-9">
        <h2 className="font-display text-2xl text-accent">One more step</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-700">
          We do not take payment on the website yet. Send us this order on WhatsApp and we will confirm the
          price, the timing and how to pay — usually within the hour.
        </p>
        <a
          href={whatsappLink(orderWhatsAppMessage(order))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-[#0a2e1f] transition-transform hover:scale-[1.02]"
        >
          <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden className="h-5 w-5">
            <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.34.65 4.53 1.78 6.4L4 29l7.76-1.73a12.9 12.9 0 0 0 4.26.73c6.62 0 12.02-5.4 12.02-12.02C28.04 8.4 22.64 3 16.02 3Zm0 21.8c-1.4 0-2.77-.31-4-.9l-.29-.15-4.6 1.02 1.05-4.48-.18-.3a9.7 9.7 0 0 1-1.5-5.17c0-5.4 4.4-9.8 9.8-9.8 5.4 0 9.8 4.4 9.8 9.8-.02 5.4-4.42 9.98-9.82 9.98Z" />
          </svg>
          Confirm on WhatsApp
        </a>
        <p className="mt-4 text-xs text-ink-700">
          Prefer to call?{" "}
          <a
            href={`tel:${BAKERY_INFO.phoneDisplay.replace(/\s/g, "")}`}
            className="font-semibold text-accent hover:underline"
          >
            {BAKERY_INFO.phoneDisplay}
          </a>
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-ink-900/10 bg-surface p-7 shadow-sm sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-ink-900">Order summary</h2>
          <Badge tone="wine">{ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}</Badge>
        </div>

        <GoldRule className="my-6" />

        <ul className="space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-5 text-sm">
              <div>
                <p className="font-medium text-ink-900">
                  {item.quantity} × {item.nameSnapshot}
                </p>
                {item.variantName && <p className="text-ink-700">{item.variantName}</p>}
              </div>
              <p className="whitespace-nowrap font-medium text-ink-900">
                {formatPrice(item.lineTotalRwf, currency)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2.5 border-t border-ink-900/10 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-700">Subtotal</dt>
            <dd className="font-medium text-ink-900">{formatPrice(order.subtotalRwf, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-700">{isDelivery ? "Delivery" : "Pickup"}</dt>
            <dd className="font-medium text-ink-900">
              {order.deliveryFeeRwf === 0 ? "Free" : formatPrice(order.deliveryFeeRwf, currency)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-ink-900/10 pt-3">
            <dt className="font-semibold text-ink-900">Total</dt>
            <dd className="font-display text-2xl font-semibold text-accent">
              {formatPrice(order.totalRwf, currency)}
            </dd>
          </div>
        </dl>

        <GoldRule className="my-6" />

        <dl className="grid gap-5 text-sm sm:grid-cols-2">
          <Detail label={isDelivery ? "Delivery date" : "Pickup date"}>
            {formatDate(order.requestedDate)}, {order.timeWindow}
          </Detail>
          <Detail label="Contact">
            {order.customerName}
            <br />
            {order.customerPhone}
            {order.customerEmail && (
              <>
                <br />
                {order.customerEmail}
              </>
            )}
          </Detail>
          {isDelivery ? (
            <Detail label="Delivering to">
              {order.address}
              {zoneLabel(order.deliveryZone) && (
                <>
                  <br />
                  <span className="text-ink-700">{zoneLabel(order.deliveryZone)}</span>
                </>
              )}
            </Detail>
          ) : (
            <Detail label="Collect from">{BAKERY_INFO.address}</Detail>
          )}
          {order.notes && <Detail label="Your notes">{order.notes}</Detail>}
        </dl>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <LinkButton href="/patisseries" variant="outline">
          Order something else
        </LinkButton>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-ink-700 hover:text-accent"
        >
          Back to home
        </Link>
      </div>
    </Container>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-700">{label}</dt>
      <dd className="mt-1 leading-relaxed text-ink-900">{children}</dd>
    </div>
  );
  
}


