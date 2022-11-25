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
    orderBy: { id: "asc" },
  });
}

async function findRoomsFromHotel(hotelId: number) {
  return prisma.room.findMany({
    where: { hotelId },
    select: {
      id: true,
      name: true,
      capacity: true,
      _count: {
        select: {
          Booking: true,
        },
      },
      Hotel: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsFromHotel,
};

export default hotelRepository;
