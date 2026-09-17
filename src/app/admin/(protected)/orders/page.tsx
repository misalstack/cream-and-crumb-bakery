import Link from "next/link";
import { Badge, EmptyState } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatRwf } from "@/lib/currency";
import { OPEN_ORDER_STATUSES, ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/enums";
import { formatDate } from "@/lib/format";
import { IS_DEMO } from "@/lib/demo";
import { prisma } from "@/lib/prisma";
import { todayUtc } from "@/lib/validation";
import type { Prisma } from "@prisma/client";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; due?: string }>;
}) {
  // No request to read query params from in a static export, so the demo
  // lists every order and hides the filter pills rather than showing controls
  // that cannot work.
  const params = IS_DEMO ? {} : await searchParams;
  const status = (ORDER_STATUSES as readonly string[]).includes(params.status ?? "")
    ? (params.status as OrderStatus)
    : null;
  const dueToday = params.due === "today";

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (dueToday) {
    // UTC boundaries to match how requestedDate is stored.
    const today = todayUtc();
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    where.requestedDate = { gte: today, lt: tomorrow };
    if (!status) where.status = { in: OPEN_ORDER_STATUSES };
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: [{ requestedDate: "asc" }, { createdAt: "desc" }],
    include: { items: true },
  });

  function href(next: { status?: string | null; due?: string | null }) {
    const qs = new URLSearchParams();
    const nextStatus = next.status === undefined ? status : next.status;
    const nextDue = next.due === undefined ? (dueToday ? "today" : null) : next.due;
    if (nextStatus) qs.set("status", nextStatus);
    if (nextDue) qs.set("due", nextDue);
    const s = qs.toString();
    return `/admin/orders${s ? `?${s}` : ""}`;
  }

  return (
    <>
      <h1 className="font-display text-4xl text-ink-900">Orders</h1>
      <p className="mt-1 text-sm text-ink-700">
        {orders.length} {orders.length === 1 ? "order" : "orders"}
        {dueToday && " due today"}
        {status && ` · ${ORDER_STATUS_LABELS[status]}`}
      </p>

      {!IS_DEMO && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Pill href={href({ status: null, due: null })} active={!status && !dueToday}>
            All
          </Pill>
          <Pill href={href({ due: dueToday ? null : "today" })} active={dueToday}>
            Due today
          </Pill>
          {ORDER_STATUSES.map((s) => (
            <Pill key={s} href={href({ status: status === s ? null : s })} active={status === s}>
              {ORDER_STATUS_LABELS[s]}
            </Pill>
          ))}
        </div>
      )}

      <div className="mt-8">
        {orders.length === 0 ? (
          <EmptyState title="No orders here" body="Try a different filter, or wait for the next customer." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-4xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wider text-ink-700">
                  <th className="py-3 pr-4 font-semibold">Order</th>
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="py-3 pr-4 font-semibold">Wanted</th>
                  <th className="py-3 pr-4 font-semibold">Fulfilment</th>
                  <th className="py-3 pr-4 font-semibold">Total</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-ink-900/5 hover:bg-cream-100">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-accent hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <span className="block text-xs text-ink-700">
                        {order.items.reduce((n, i) => n + i.quantity, 0)} items
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-ink-900">
                      {order.customerName}
                      <span className="block text-xs text-ink-700">{order.customerPhone}</span>
                    </td>
                    <td className="py-3 pr-4 text-ink-700">
                      {formatDate(order.requestedDate)}
                      <span className="block text-xs">{order.timeWindow}</span>
                    </td>
                    <td className="py-3 pr-4 text-ink-700">
                      {order.fulfillment === "DELIVERY" ? "Delivery" : "Pickup"}
                      {order.fulfillment === "DELIVERY" && (
                        <span className="block text-xs">{order.deliveryZone}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-medium text-ink-900">{formatRwf(order.totalRwf)}</td>
                    <td className="py-3">
                      <Badge
                        tone={
                          order.status === "CANCELLED"
                            ? "danger"
                            : order.status === "COMPLETED"
                              ? "success"
                              : "wine"
                        }
                      >
                        {ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
        active
          ? "border-wine-800 bg-wine-800 text-paper-50"
          : "border-ink-900/15 text-ink-700 hover:border-accent/40 hover:text-accent",
      )}
    >
      {children}
    </Link>
  );
}
