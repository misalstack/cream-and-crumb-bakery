/** Dev helper: dump recent orders so checkout can be verified end to end. */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  });
  console.log(JSON.stringify(orders, null, 2));
  console.log(`\ncounts: orders=${await prisma.order.count()} items=${await prisma.orderItem.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
