import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash: 'placeholder',
      name: 'Demo User',
    },
  });

  const listing = await prisma.listing.create({
    data: {
      title: '2018 BMW 3 Series',
      description: 'Clean, one owner',
      price: 1450000,
      currency: 'USD',
      make: 'BMW',
      model: '3 Series',
      year: 2018,
      mileage: 42000,
      location: '94105',
      images: [],
      userId: user.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seeded user:', user);
  // eslint-disable-next-line no-console
  console.log('Seeded listing:', listing);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
