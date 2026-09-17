import Link from "next/link";
import { Badge, Card, GoldRule } from "@/components/ui";
import { formatRwf } from "@/lib/currency";
import { OPEN_ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/enums";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { todayUtc } from "@/lib/validation";

export default async function AdminDashboard() {
  const today = todayUtc();
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));

  // All date boundaries are built with Date.UTC to match how requestedDate is
  // stored (UTC midnight, parsed from a date-only string). Using local
  // midnight here would mis-bucket same-day orders whenever the server is not
  // running in UTC.
  const [dueToday, openOrders, newRequests, unreadMessages, monthRevenue, recentOrders, soldOut] =
    await Promise.all([
      prisma.order.count({
        where: {
          requestedDate: { gte: today, lt: tomorrow },
          status: { in: OPEN_ORDER_STATUSES },
        },
      }),
      prisma.order.count({ where: { status: { in: OPEN_ORDER_STATUSES } } }),
      prisma.customCakeRequest.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.order.aggregate({
        _sum: { totalRwf: true },
        where: { createdAt: { gte: monthStart }, status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { items: true } }),
      prisma.product.findMany({ where: { isSoldOut: true, isActive: true }, select: { id: true, name: true } }),
    ]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-700">{formatDate(new Date())}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Due today" value={String(dueToday)} href="/admin/orders?due=today" />
        <Stat label="Open orders" value={String(openOrders)} href="/admin/orders" />
        <Stat label="Revenue this month" value={formatRwf(monthRevenue._sum.totalRwf ?? 0)} />
        <Stat
          label="Needs a reply"
          value={String(newRequests + unreadMessages)}
          href={newRequests > 0 ? "/admin/custom-cakes" : "/admin/messages"}
        />
      </div>

      {soldOut.length > 0 && (
        <Card className="mt-8 border-amber-500/30 bg-amber-500/5 p-5">
          <p className="text-sm text-ink-900">
            <strong>{soldOut.length}</strong>{" "}
            {soldOut.length === 1 ? "product is" : "products are"} marked sold out and hidden from ordering:{" "}
            <span className="text-ink-700">{soldOut.map((p) => p.name).join(", ")}</span>.{" "}
            <Link href="/admin/products" className="font-semibold text-accent underline underline-offset-4">
              Manage stock
            </Link>
          </p>
        </Card>
      )}

      <GoldRule className="my-10" />

      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-ink-900">Latest orders</h2>
        <Link href="/admin/orders" className="text-sm font-semibold text-accent hover:underline">
          All orders →
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-ink-900/15 px-6 py-10 text-center text-sm text-ink-700">
          No orders yet. They will appear here the moment a customer checks out.
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-4xl border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wider text-ink-700">
                <th className="py-3 pr-4 font-semibold">Order</th>
                <th className="py-3 pr-4 font-semibold">Customer</th>
                <th className="py-3 pr-4 font-semibold">Wanted</th>
                <th className="py-3 pr-4 font-semibold">Items</th>
                <th className="py-3 pr-4 font-semibold">Total</th>
                <th className="py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-ink-900/5">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-semibold text-accent hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-ink-900">
                    {order.customerName}
                    <span className="block text-xs text-ink-700">{order.customerPhone}</span>
                  </td>
                  <td className="py-3 pr-4 text-ink-700">
                    {formatDate(order.requestedDate)}
                    <span className="block text-xs">
                      {order.fulfillment === "DELIVERY" ? "Delivery" : "Pickup"} · {order.timeWindow}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-ink-700">
                    {order.items.reduce((n, i) => n + i.quantity, 0)}
                  </td>
                  <td className="py-3 pr-4 font-medium text-ink-900">{formatRwf(order.totalRwf)}</td>
                  <td className="py-3">
                    <Badge tone={order.status === "CANCELLED" ? "danger" : order.status === "COMPLETED" ? "success" : "wine"}>
                      {ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <Card className="p-6 transition-shadow hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">{label}</p>
      <p className="mt-2 font-display text-3xl text-accent">{value}</p>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
