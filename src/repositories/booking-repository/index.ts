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

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({ where: { userId } });
}

async function updateBooking(id: number, roomId: number) {
  return prisma.booking.update({ where: { id }, data: { roomId } });
}

const bookingRepository = {
  findBooking,
  createBooking,
  findBookingByUserId,
  updateBooking,
};

export default bookingRepository;
