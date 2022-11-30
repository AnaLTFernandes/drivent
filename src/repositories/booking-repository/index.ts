import { prisma } from "@/config";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: {
        include: {
          Hotel: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
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

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({ data: { userId, roomId } });
}

const bookingRepository = {
  findBooking,
  createBooking,
};

export default bookingRepository;
