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

async function findHotelById(id: number) {
  return prisma.hotel.findUnique({
    where: { id },
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
    },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsFromHotel,
  findHotelById,
};

export default hotelRepository;
