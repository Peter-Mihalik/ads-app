import { PrismaClient } from "./data/prisma/index.js"

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  const company = await prisma.company.findFirst();
  console.log(company);
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
