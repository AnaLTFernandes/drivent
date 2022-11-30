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

async function upsertBooking({ id, roomId, userId }: UpsertBookingParams) {
  return prisma.booking.upsert({ where: { id }, update: { roomId }, create: { userId, roomId } });
}

type UpsertBookingParams = { id: number; roomId: number; userId: number };

const bookingRepository = {
  findBooking,
  findBookingByUserId,
  upsertBooking,
};

export default bookingRepository;
