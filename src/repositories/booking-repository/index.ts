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

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({ where: { userId } });
}

async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({ data: { userId, roomId } });
}

async function updateBooking(id: number, roomId: number) {
  return prisma.booking.update({ where: { id }, data: { roomId } });
}

const bookingRepository = {
  findBooking,
  findBookingByUserId,
  createBooking,
  updateBooking,
};

export default bookingRepository;
