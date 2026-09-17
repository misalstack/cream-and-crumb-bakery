import { prisma } from "@/lib/prisma";
import { BAKERY_INFO, deliveryZoneById } from "@/lib/bakery-info";
import { formatRwf } from "@/lib/currency";
import { formatDate } from "@/lib/format";

// Unambiguous alphabet — no O/0/I/1, so numbers read over the phone survive.
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function randomCode(length = 6) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

/** Generates an order number, retrying on the (unlikely) collision. */
export async function generateOrderNumber() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `SC-${randomCode()}`;
    const existing = await prisma.order.findUnique({ where: { orderNumber: candidate } });
    if (!existing) return candidate;
  }
  // Astronomically unlikely; fall back to something guaranteed unique.
  return `SC-${Date.now().toString(36).toUpperCase()}`;
}

export type OrderWithItems = Awaited<ReturnType<typeof getOrderByNumber>>;

export function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

/**
 * The message a customer sends us to confirm their order. Checkout saves the
 * order but takes no payment, so this handoff is what actually closes the loop
 * — keep it complete enough that the bakery can act on it alone.
 */
export function orderWhatsAppMessage(order: {
  orderNumber: string;
  customerName: string;
  fulfillment: string;
  requestedDate: Date;
  timeWindow: string;
  totalRwf: number;
  items: { nameSnapshot: string; variantName: string | null; quantity: number }[];
}) {
  const lines = [
    `Hello ${BAKERY_INFO.name}! I placed order ${order.orderNumber} on your website.`,
    "",
    ...order.items.map(
      (i) => `• ${i.quantity} × ${i.nameSnapshot}${i.variantName ? ` (${i.variantName})` : ""}`,
    ),
    "",
    `${order.fulfillment === "DELIVERY" ? "Delivery" : "Pickup"}: ${formatDate(order.requestedDate)}, ${order.timeWindow}`,
    `Total: ${formatRwf(order.totalRwf)}`,
    "",
    `Name: ${order.customerName}`,
    "Please confirm — thank you!",
  ];
  return lines.join("\n");
}

/** Human label for a stored delivery zone id. */
export function zoneLabel(zoneId: string | null) {
  const zone = deliveryZoneById(zoneId);
  return zone ? `${zone.name} (${zone.areas})` : null;
}
