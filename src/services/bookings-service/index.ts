import { Hotel, Room, TicketStatus } from "@prisma/client";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { forbiddenError } from "./errors";

async function getBooking(userId: number): Promise<GetBookingResult> {
  const bookingResult = await bookingRepository.findBooking(userId);

  if (!bookingResult) throw notFoundError();

  const booking = {
    bookingId: bookingResult.id,
    hotel: bookingResult.Room.Hotel,
    room: {
      id: bookingResult.Room.id,
      name: bookingResult.Room.name,
      capacity: bookingResult.Room.capacity,
      hotelId: bookingResult.Room.hotelId,
      bookeds: bookingResult.Room._count.Booking,
    },
  };

  return booking;
}

type GetBookingResult = {
  bookingId: number;
  hotel: Omit<Hotel, "createdAt" | "updatedAt">;
  room: Omit<Room, "createdAt" | "updatedAt"> & { bookeds: number };
};

async function postBooking(userId: number, roomId: number): Promise<PostBookingResult> {
  await validateUserEnrollmentAndTicketOrFail(userId);

  const room = await hotelRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.upsertBooking({ id: 0, roomId, userId });

  return { bookingId: booking.id };
}

type PostBookingResult = { bookingId: number };

async function putBooking(userId: number, roomId: number, bookingId: number): Promise<PutBookingResult> {
  await validateUserEnrollmentAndTicketOrFail(userId);

  const userBooking = await bookingRepository.findBookingByUserId(userId);

  if (!userBooking || userBooking.id !== bookingId) throw forbiddenError();

  const room = await hotelRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.upsertBooking({ id: bookingId, roomId, userId });

  return { bookingId: booking.id };
}

type PutBookingResult = { bookingId: number };

async function validateUserEnrollmentAndTicketOrFail(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw forbiddenError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (
    !ticket ||
    !ticket.TicketType.includesHotel ||
    ticket.TicketType.isRemote ||
    ticket.status !== TicketStatus.PAID
  ) {
    throw forbiddenError();
  }
}

const bookingsService = {
  getBooking,
  postBooking,
  putBooking,
};

export default bookingsService;
