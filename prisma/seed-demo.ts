/**
 * Extra data for the static demo build only — a handful of orders, enquiries
 * and messages so the admin walkthrough has something in it. Without this the
 * dashboard and every inbox render empty, which demos badly.
 *
 *   npx tsx prisma/seed-demo.ts
 *
 * Never run this against a real database: `npx tsx scripts/reset-demo-data.ts`
 * clears everything it creates.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** UTC midnight `offsetDays` from today, matching how requestedDate is stored. */
function dayUtc(offsetDays: number) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d;
}

async function main() {
  const bySlug = new Map(
    (await prisma.product.findMany({ include: { variants: true } })).map((p) => [p.slug, p]),
  );
  const pick = (slug: string) => {
    const product = bySlug.get(slug);
    if (!product) throw new Error(`Demo seed expected product "${slug}" — run prisma/seed.ts first.`);
    return product;
  };

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customCakeRequest.deleteMany();
  await prisma.contactMessage.deleteMany();

  type DemoLine = { slug: string; quantity: number; variantIndex?: number };
  type DemoOrder = {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    fulfillment: string;
    deliveryZone: string | null;
    deliveryFeeRwf: number;
    address: string | null;
    requestedDate: Date;
    timeWindow: string;
    notes: string | null;
    status: string;
    lines: DemoLine[];
  };

  const orders: DemoOrder[] = [
    {
      orderNumber: "SC-DEMO01",
      customerName: "Aline Uwase",
      customerPhone: "0788 123 456",
      customerEmail: "aline@example.rw",
      fulfillment: "DELIVERY",
      deliveryZone: "CENTRAL",
      deliveryFeeRwf: 2000,
      address: "House 12, KG 7 Ave, near the Kimihurura roundabout",
      requestedDate: dayUtc(0),
      timeWindow: "10:00 — 12:00",
      notes: 'Please pipe "Happy Birthday Keza" on the cake.',
      status: "CONFIRMED",
      lines: [
        { slug: "classic-birthday-cake", quantity: 1, variantIndex: 1 },
        { slug: "butter-croissant", quantity: 4 },
        { slug: "chocolate-chip-cookie", quantity: 4 },
      ],
    },
    {
      orderNumber: "SC-DEMO02",
      customerName: "Jean-Paul Rwema",
      customerPhone: "0788 999 111",
      customerEmail: "jp@example.rw",
      fulfillment: "DELIVERY",
      deliveryZone: "MID",
      deliveryFeeRwf: 0,
      address: "Norrsken House, KN 78 St, Kiyovu — reception desk",
      requestedDate: dayUtc(0),
      timeWindow: "08:00 — 10:00",
      notes: "Office launch — please deliver warm if you can.",
      status: "BAKING",
      lines: [
        { slug: "office-box", quantity: 4 },
        { slug: "pain-au-chocolat", quantity: 12 },
      ],
    },
    {
      orderNumber: "SC-DEMO03",
      customerName: "Grace Uwimana",
      customerPhone: "0788 777 222",
      customerEmail: null,
      fulfillment: "PICKUP",
      deliveryZone: null,
      deliveryFeeRwf: 0,
      address: null,
      requestedDate: dayUtc(2),
      timeWindow: "16:00 — 18:00",
      notes: null,
      status: "PENDING",
      lines: [
        { slug: "cinnamon-roll", quantity: 6 },
        { slug: "chicken-pie", quantity: 4 },
      ],
    },
    {
      orderNumber: "SC-DEMO04",
      customerName: "Chantal Mukamana",
      customerPhone: "0788 444 909",
      customerEmail: "chantal@example.rw",
      fulfillment: "DELIVERY",
      deliveryZone: "OUTER",
      deliveryFeeRwf: 4000,
      address: "Kicukiro Centre, near the market",
      requestedDate: dayUtc(-3),
      timeWindow: "14:00 — 16:00",
      notes: null,
      status: "COMPLETED",
      lines: [{ slug: "chocolate-fudge-cake", quantity: 1, variantIndex: 2 }],
    },
  ];

  for (const o of orders) {
    const items = o.lines.map((line) => {
      const product = pick(line.slug);
      const variant =
        line.variantIndex !== undefined ? product.variants[line.variantIndex] ?? null : null;
      const unitPriceRwf = variant?.priceRwf ?? product.priceRwf;
      return {
        nameSnapshot: product.name,
        variantName: variant?.name ?? null,
        unitPriceRwf,
        quantity: line.quantity,
        lineTotalRwf: unitPriceRwf * line.quantity,
        productId: product.id,
      };
    });
    const subtotalRwf = items.reduce((n, i) => n + i.lineTotalRwf, 0);

    await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerEmail: o.customerEmail,
        fulfillment: o.fulfillment,
        deliveryZone: o.deliveryZone,
        deliveryFeeRwf: o.deliveryFeeRwf,
        address: o.address,
        requestedDate: o.requestedDate,
        timeWindow: o.timeWindow,
        notes: o.notes,
        subtotalRwf,
        totalRwf: subtotalRwf + o.deliveryFeeRwf,
        status: o.status,
        items: { create: items },
      },
    });
  }

  await prisma.customCakeRequest.createMany({
    data: [
      {
        name: "Grace Uwimana",
        phone: "0788 777 222",
        email: "grace@example.rw",
        occasion: "Wedding",
        eventDate: dayUtc(21),
        servings: 80,
        flavour: "Red velvet and vanilla",
        budgetRwf: 200000,
        description:
          "Three tiers, ivory and gold, fresh flowers on top. Traditional dowry ceremony in the morning, reception at four.",
        status: "NEW",
      },
      {
        name: "Eric Habimana",
        phone: "0788 321 654",
        email: null,
        occasion: "Graduation",
        eventDate: dayUtc(9),
        servings: 25,
        flavour: "Chocolate fudge",
        budgetRwf: 45000,
        description:
          "Navy and gold, with a little sugar mortarboard on top if that's possible. Name is Eric.",
        status: "CONTACTED",
      },
    ],
  });

  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Jean-Paul Rwema",
        email: "jp@example.rw",
        phone: "0788 999 111",
        subject: "Corporate order for 120 pastries",
        message:
          "We need 120 assorted pastries delivered to Kacyiru at 7am on the 20th. Can you quote, and do you invoice?",
        isRead: false,
      },
      {
        name: "Diane K.",
        email: "diane@example.rw",
        phone: null,
        subject: "Gluten free options?",
        message: "Do you make anything gluten free, or is everything baked in the same kitchen?",
        isRead: true,
      },
    ],
  });

  console.log(
    `Demo data: ${orders.length} orders, 2 custom cake requests, 2 messages.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
