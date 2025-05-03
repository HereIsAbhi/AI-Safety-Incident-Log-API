const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.incident.create({
    data: {
      title: 'Test Incident',
      description: 'This is a test incident.',
      severity: 'High',
    },
  });
  console.log('Seeded!');
}

main()
  .catch(e => { throw e })
  .finally(async () => { await prisma.$disconnect() }); 