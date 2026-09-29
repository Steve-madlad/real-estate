import { prisma } from "../lib/db.js";

async function main() {
  const deleted = await prisma.$transaction(async (transaction) => {
    const properties = await transaction.property.findMany({
      select: { id: true },
    });
    const propertyIds = properties.map(({ id }) => id);

    if (propertyIds.length === 0) {
      return { properties: 0, applications: 0, leases: 0, payments: 0 };
    }

    const leases = await transaction.lease.findMany({
      where: { propertyId: { in: propertyIds } },
      select: { id: true },
    });
    const leaseIds = leases.map(({ id }) => id);

    const payments = await transaction.payment.deleteMany({
      where: { leaseId: { in: leaseIds } },
    });
    const applications = await transaction.application.deleteMany({
      where: { propertyId: { in: propertyIds } },
    });
    const deletedLeases = await transaction.lease.deleteMany({
      where: { id: { in: leaseIds } },
    });
    const deletedProperties = await transaction.property.deleteMany({
      where: { id: { in: propertyIds } },
    });

    return {
      properties: deletedProperties.count,
      applications: applications.count,
      leases: deletedLeases.count,
      payments: payments.count,
    };
  });

  console.log(
    `Deleted ${deleted.properties} properties, ${deleted.applications} applications, ${deleted.leases} leases, and ${deleted.payments} payments.`,
  );
}

main()
  .catch((error) => {
    console.error("Property deletion failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
