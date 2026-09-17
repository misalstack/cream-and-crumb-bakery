import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/app/admin/actions";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Badge, Card, GoldRule } from "@/components/ui";
import { BAKERY_INFO, whatsappLink } from "@/lib/bakery-info";
import { formatRwf } from "@/lib/currency";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/enums";
import { formatDate, formatDateTime } from "@/lib/format";
import { IS_DEMO } from "@/lib/demo";
import { orderWhatsAppMessage, zoneLabel } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

// Demo build pre-renders a page per seeded order (see prisma/seed-demo.ts).
export async function generateStaticParams() {
  if (!IS_DEMO) return [];
  const orders = await prisma.order.findMany({ select: { id: true } });
  return orders.map((o) => ({ id: o.id }));
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const isDelivery = order.fulfillment === "DELIVERY";

  return (
    <>
      <Link href="/admin/orders" className="text-sm text-ink-700 hover:text-accent">
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="font-display text-4xl text-ink-900">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink-700">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            tone={order.status === "CANCELLED" ? "danger" : order.status === "COMPLETED" ? "success" : "wine"}
          >
            {ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}
          </Badge>
          <StatusSelect
            action={IS_DEMO ? undefined : updateOrderStatus}
            idName="orderId"
            idValue={order.id}
            current={order.status}
            options={ORDER_STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] }))}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-7">
          <h2 className="font-display text-2xl text-ink-900">Items</h2>
          <GoldRule className="my-5" />
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-5 text-sm">
                <div>
                  <p className="font-medium text-ink-900">
                    {item.quantity} × {item.nameSnapshot}
                  </p>
                  {item.variantName && <p className="text-ink-700">{item.variantName}</p>}
                  <p className="text-xs text-ink-700">{formatRwf(item.unitPriceRwf)} each</p>
                </div>
                <p className="whitespace-nowrap font-medium text-ink-900">{formatRwf(item.lineTotalRwf)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2.5 border-t border-ink-900/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-700">Subtotal</dt>
              <dd className="font-medium text-ink-900">{formatRwf(order.subtotalRwf)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-700">{isDelivery ? "Delivery" : "Pickup"}</dt>
              <dd className="font-medium text-ink-900">
                {order.deliveryFeeRwf === 0 ? "Free" : formatRwf(order.deliveryFeeRwf)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink-900/10 pt-3">
              <dt className="font-semibold text-ink-900">Total</dt>
              <dd className="font-display text-2xl font-semibold text-accent">{formatRwf(order.totalRwf)}</dd>
            </div>
          </dl>

          {order.notes && (
            <div className="mt-6 rounded-xl bg-blush-100 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Customer notes</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-900">{order.notes}</p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-7">
            <h2 className="font-display text-2xl text-ink-900">Customer</h2>
            <GoldRule className="my-5" />
            <dl className="space-y-4 text-sm">
              <Detail label="Name">{order.customerName}</Detail>
              <Detail label="Phone">
                <a href={`tel:${order.customerPhone}`} className="text-accent hover:underline">
                  {order.customerPhone}
                </a>
              </Detail>
              {order.customerEmail && (
                <Detail label="Email">
                  <a href={`mailto:${order.customerEmail}`} className="text-accent hover:underline">
                    {order.customerEmail}
                  </a>
                </Detail>
              )}
              <Detail label={isDelivery ? "Delivery date" : "Pickup date"}>
                {formatDate(order.requestedDate)} · {order.timeWindow}
              </Detail>
              {isDelivery ? (
                <Detail label="Address">
                  {order.address}
                  {zoneLabel(order.deliveryZone) && (
                    <span className="mt-0.5 block text-xs text-ink-700">{zoneLabel(order.deliveryZone)}</span>
                  )}
                </Detail>
              ) : (
                <Detail label="Collecting from">{BAKERY_INFO.address}</Detail>
              )}
            </dl>

            <a
              href={whatsappLink(orderWhatsAppMessage(order))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#0a2e1f]"
            >
              Message the customer
            </a>
          </Card>

          <Card className="p-7">
            <h2 className="font-display text-xl text-ink-900">Payment</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              This order was placed without online payment. Confirm the amount and collect it by mobile money
              or on collection, then move the order along as you go.
            </p>
          </Card>
        </div>
      </div>
    </>
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
