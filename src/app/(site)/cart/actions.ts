"use server";

import { prisma } from "@/lib/prisma";
import {
  DELIVERY_ZONES,
  TIME_WINDOWS,
  deliveryFeeFor,
} from "@/lib/bakery-info";
import { FULFILLMENT_METHODS } from "@/lib/enums";
import { generateOrderNumber } from "@/lib/orders";
import { ActionState, Validator, todayUtc } from "@/lib/validation";

type IncomingLine = { productId: string; variantId: string | null; quantity: number };

function parseLines(raw: FormDataEntryValue | null): IncomingLine[] {
  if (typeof raw !== "string") return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((entry): IncomingLine[] => {
    if (typeof entry !== "object" || entry === null) return [];
    const e = entry as Record<string, unknown>;
    const quantity = Number(e.quantity);
    if (typeof e.productId !== "string" || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return [];
    }
    return [
      {
        productId: e.productId,
        variantId: typeof e.variantId === "string" ? e.variantId : null,
        quantity,
      },
    ];
  });
}

export async function placeOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const lines = parseLines(formData.get("items"));
  if (lines.length === 0) {
    return { ok: false, message: "Your cart is empty. Add something delicious first." };
  }

  // ---- Re-price on the server -------------------------------------------
  // The cart lives in the browser, so its prices are only a display value.
  // Everything that touches money below is read fresh from the database.
  const products = await prisma.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) } },
    include: { variants: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const priced: {
    productId: string;
    nameSnapshot: string;
    variantName: string | null;
    unitPriceRwf: number;
    quantity: number;
    lineTotalRwf: number;
  }[] = [];

  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product || !product.isActive) {
      return { ok: false, message: "One of the items in your cart is no longer available. Please review your cart." };
    }
    if (product.isSoldOut) {
      return { ok: false, message: `${product.name} has just sold out. Please remove it and try again.` };
    }

    const variant = line.variantId ? product.variants.find((v) => v.id === line.variantId) : null;
    if (line.variantId && !variant) {
      return { ok: false, message: `The size chosen for ${product.name} is no longer offered. Please pick another.` };
    }

    const unitPriceRwf = variant?.priceRwf ?? product.priceRwf;
    priced.push({
      productId: product.id,
      nameSnapshot: product.name,
      variantName: variant?.name ?? null,
      unitPriceRwf,
      quantity: line.quantity,
      lineTotalRwf: unitPriceRwf * line.quantity,
    });
  }

  const subtotalRwf = priced.reduce((sum, l) => sum + l.lineTotalRwf, 0);

  // ---- Customer and fulfilment details ----------------------------------
  const v = new Validator(formData);
  const customerName = v.required("customerName", "Name", { max: 120 });
  const customerPhone = v.phone("customerPhone", "Phone number");
  const customerEmail = v.email("customerEmail", "Email");
  const fulfillment = v.oneOf("fulfillment", "Fulfilment method", FULFILLMENT_METHODS);
  const timeWindow = v.oneOf("timeWindow", "Time window", TIME_WINDOWS);
  const notes = v.optional("notes", "Notes", { max: 1000 });

  // The kitchen can't conjure a 2-day cake tomorrow — the earliest acceptable
  // date is driven by the slowest item actually in the cart.
  const maxLeadHours = Math.max(0, ...priced.map((l) => byId.get(l.productId)?.leadTimeHours ?? 0));
  const leadDays = Math.ceil(maxLeadHours / 24);
  const earliest = new Date(todayUtc());
  earliest.setUTCDate(earliest.getUTCDate() + leadDays);

  // Two distinct failures with two distinct messages: a date genuinely in the
  // past, versus a valid future date that is still too soon for the slowest
  // item in the basket. Folding them together told customers their order was
  // "in the past" when they had picked today for a cake needing a day's notice.
  const requestedDate = v.date("requestedDate", "Date", { required: true, notBefore: todayUtc() });
  if (!v.errors.requestedDate && requestedDate && requestedDate.getTime() < earliest.getTime()) {
    const slowest = priced
      .map((l) => byId.get(l.productId))
      .filter((p) => p && p.leadTimeHours === maxLeadHours)[0];
    v.errors.requestedDate = `${slowest?.name ?? "One item"} needs ${leadDays} day${
      leadDays === 1 ? "" : "s"
    } notice — please choose ${earliest.toISOString().slice(0, 10)} or later.`;
  }

  let deliveryZone: string | null = null;
  let address: string | null = null;
  if (fulfillment === "DELIVERY") {
    deliveryZone = v.oneOf(
      "deliveryZone",
      "Delivery zone",
      DELIVERY_ZONES.map((z) => z.id),
    );
    address = v.required("address", "Delivery address", { max: 400 });
  }

  if (v.hasErrors) {
    return { ok: false, errors: v.errors, message: "Please check the highlighted fields." };
  }

  const deliveryFeeRwf = fulfillment === "DELIVERY" ? deliveryFeeFor(deliveryZone, subtotalRwf) : 0;
  const totalRwf = subtotalRwf + deliveryFeeRwf;

  const orderNumber = await generateOrderNumber();
  await prisma.order.create({
    data: {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      fulfillment,
      deliveryZone,
      deliveryFeeRwf,
      address,
      requestedDate: requestedDate!,
      timeWindow,
      notes,
      subtotalRwf,
      totalRwf,
      items: { create: priced },
    },
  });

  return { ok: true, redirectTo: `/order/${orderNumber}` };
}
