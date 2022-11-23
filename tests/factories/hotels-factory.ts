import faker from "@faker-js/faker";
import { prisma } from "@/config";

export function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.city(),
      Rooms: {
        create: {
          name: faker.name.findName(),
          capacity: faker.datatype.number({ min: 1, max: 3 }),
        },
      },
    },
    include: {
      Rooms: true,
    },
  });
}
