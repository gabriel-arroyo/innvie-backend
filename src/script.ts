import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // await prisma.accessories.deleteMany({});
  // await prisma.types.deleteMany({});
  // await prisma.accessories.create({
  // 	data: {
  // 		name: "TV",
  // 	},
  // });
  // await prisma.types.create({
  // 	data: {
  // 		name: "Single",
  // 		// accessories: {
  // 		// 	connect: {
  // 		// 		name: "TV",
  // 		// 	},
  // 		// },
  // 	},
  // });
  // await prisma.accessories.create({
  // 	data: {
  // 		name: "TV",
  // 	},
  // });

  // await prisma.typesToAccessories.create({
  // 	data: {
  // 		typeId: "96490d19-0b8c-4ef3-8551-687871d410be",
  // 		accessoryId: "0b07c024-d4f4-4f36-92c8-02e66d809039",
  // 	},
  // });

  const typesWithAccessories = await prisma.types.findMany({
    include: {
      accessories: {
        include: {
          accessory: true,
        },
      },
    },
  })

  const result = typesWithAccessories.map((type) => {
    return {
      type: type.name,
      accessories: type.accessories.map(
        (accessory) => accessory.accessory.name,
      ),
    }
  })

  console.log(result)
  console.log(JSON.stringify(result))
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
