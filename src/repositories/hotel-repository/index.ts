import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      Rooms: {
        select: {
          capacity: true,
          _count: {
            select: {
              Booking: true,
            },
          },
        },
      },
    },
  });
}

const hotelRepository = {
  findHotels,
};

export default hotelRepository;
