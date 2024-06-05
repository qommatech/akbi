import { PrismaClient } from "@prisma/client";

import { hash } from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const abi = await prisma.user.upsert({
    where: { email: "abi@gmail.com" },
    update: {},
    create: {
      email: "abi@gmail.com",
      name: "Abi Al Qhafari",
      username: "abi123",
      password: await hash("123456", 10),
    },
  });
  const akmal = await prisma.user.upsert({
    where: { email: "akmal@gmail.com" },
    update: {},
    create: {
      email: "akmal@gmail.com",
      name: "Farih Akmal",
      username: "akmal123",
      password: await hash("123456", 10),
    },
  });

  // Create friendship between Abi and Akmal
  //   await prisma.friend.createMany({
  //     data: [
  //       {
  //         userId: abi.id,
  //         friendId: akmal.id,
  //       },
  //       {
  //         userId: akmal.id,
  //         friendId: abi.id,
  //       },
  //     ],
  //   });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
