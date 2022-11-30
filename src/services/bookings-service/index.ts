import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel, Room, TicketStatus } from "@prisma/client";
import { forbiddenError } from "./errors";

async function getBooking(userId: number): Promise<GetBookingResult> {
  const bookingResult = await bookingRepository.findBooking(userId);

  if (!bookingResult) throw notFoundError();

  const booking = {
    bookingId: bookingResult.id,
    bookeds: bookingResult.Room._count.Booking,
    hotel: bookingResult.Room.Hotel,
    room: {
      id: bookingResult.Room.id,
      name: bookingResult.Room.name,
      capacity: bookingResult.Room.capacity,
      hotelId: bookingResult.Room.hotelId,
    },
  };

  return booking;
}

type GetBookingResult = {
  bookingId: number;
  bookeds: number;
  hotel: Omit<Hotel, "createdAt" | "updatedAt">;
  room: Omit<Room, "createdAt" | "updatedAt">;
};

async function postBooking(userId: number, roomId: number): Promise<PostBookingResult> {
  await validateUserEnrollmentAndTicketOrFail(userId);

  const room = await hotelRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.createBooking(userId, roomId);

  return { bookingId: booking.id };
}

type PostBookingResult = { bookingId: number };

async function putBooking(userId: number, roomId: number, bookingId: number): Promise<PuBookingResult> {
  await validateUserEnrollmentAndTicketOrFail(userId);

  const userBooking = await bookingRepository.findBookingByUserId(userId);

  if (!userBooking || userBooking.id !== bookingId) throw forbiddenError();

  const room = await hotelRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.updateBooking(bookingId, roomId);

  return { bookingId: booking.id };
}

type PuBookingResult = { bookingId: number };

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
