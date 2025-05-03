const { PrismaClient } =  require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const incidents = await prisma.incident.findMany();
  console.log(incidents);
}

main()
  .catch(e => { throw e })
  .finally(async () => { await prisma.$disconnect() }); 